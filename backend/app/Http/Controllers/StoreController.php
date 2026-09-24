<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreController extends Controller
{
    public function products(): JsonResponse
    {
        if ($url = config('services.supplier.products_url')) {
            try {
                $products = Cache::store('file')->remember('supplier.products.v2.'.hash('sha256', $url), 60, function () use ($url): array {
                    $data = Http::acceptJson()->connectTimeout(5)->timeout(15)->get($url)->throw()->json();
                    if (! is_array($data) || ($data['code'] ?? null) !== 200 || ! is_array($data['payload'] ?? null)) {
                        throw new \UnexpectedValueException('Invalid supplier catalog response.');
                    }

                    return collect($data['payload'])->filter(fn (array $product): bool => ($product['status'] ?? null) === 'active')
                        ->map(fn (array $product): array => [
                            'id' => (int) $product['id'],
                            'name' => $product['name'],
                            'slug' => $product['slug'],
                            'category' => $product['category'] ?? 'Others',
                            'picture' => $product['picture'] ?? '',
                            'discountTag' => ! empty($product['discount_tag']) ? $product['discount_tag'].'% OFF' : null,
                            'rating' => (float) ($product['average_rating'] ?? 0),
                            'reviewsCount' => (int) ($product['total_reviews'] ?? 0),
                            'minPrice' => isset($product['price_range']['min']) ? (float) $product['price_range']['min'] : null,
                            'maxPrice' => isset($product['price_range']['max']) ? (float) $product['price_range']['max'] : null,
                            'description' => $this->cleanDescription($product['description'] ?: ($product['meta_description'] ?? '')),
                            'isGiftCard' => (bool) ($product['is_gift_card'] ?? false),
                            'packages' => [],
                            'source' => 'supplier',
                            'gameGroup' => $product['game_group'] ?? null,
                        ])->values()->all();
                });

                return response()->json(['products' => $products]);
            } catch (\Throwable $exception) {
                report($exception);

                return response()->json(['message' => 'The product catalog is temporarily unavailable. Please try again.'], 503);
            }
        }

        return response()->json(['products' => DB::table('products')->orderBy('id')->get()->map(fn ($row) => array_merge(json_decode($row->data, true), ['id' => $row->id, 'slug' => $row->slug]))]);
    }

    public function productDetails(string $slug): JsonResponse
    {
        $url = config('services.supplier.products_url');
        abort_unless($url, 404);

        try {
            $catalog = $this->products();
            if ($catalog->getStatusCode() !== 200) {
                return $catalog;
            }
            $products = collect($catalog->getData(true)['products']);
            $product = $products->firstWhere('slug', $slug);
            if (! $product) {
                $parent = $products->first(function (array $candidate) use ($slug): bool {
                    return collect(data_get($candidate, 'gameGroup.variants', []))->contains('slug', $slug);
                });
                $variant = collect(data_get($parent, 'gameGroup.variants', []))->firstWhere('slug', $slug);
                if ($parent && $variant) {
                    $product = array_merge($parent, [
                        'id' => (int) $variant['id'],
                        'name' => $variant['name'],
                        'slug' => $variant['slug'],
                        'picture' => $variant['picture'],
                        'discountTag' => isset($variant['discount_tag']) ? $variant['discount_tag'].'% OFF' : null,
                        'rating' => (float) ($variant['average_rating'] ?? 0),
                        'reviewsCount' => (int) ($variant['total_reviews'] ?? 0),
                    ]);
                }
            }
            if (! $product) {
                return response()->json(['message' => 'Product not found.'], 404);
            }

            $result = Cache::remember('supplier.detail.v2.'.hash('sha256', $url.$slug), 60, function () use ($url, $slug, $product): array {
                $detail = Http::acceptJson()->connectTimeout(5)->timeout(15)
                    ->get(rtrim($url, '/').'/'.rawurlencode($slug))->throw()->json();
                $items = Http::acceptJson()->connectTimeout(5)->timeout(15)
                    ->get(dirname($url).'/product-items/'.$product['id'], ['currency_code' => 'PHP'])->throw()->json();
                if (($detail['code'] ?? null) !== 200 || (int) ($detail['payload']['id'] ?? 0) !== $product['id'] ||
                    ($items['code'] ?? null) !== 200 || ! is_array($items['payload'] ?? null)) {
                    throw new \UnexpectedValueException('Invalid supplier product details.');
                }

                $product['description'] = $this->cleanDescription($detail['payload']['description'] ?? $product['description']);
                $product['inputFields'] = collect($detail['payload']['input_format'] ?? [])
                    ->filter(fn ($field): bool => is_array($field) && is_string($field['name'] ?? null))
                    ->map(fn (array $field): array => [
                        'name' => $field['name'],
                        'label' => (string) ($field['label'] ?? $field['name']),
                        'placeholder' => (string) ($field['placeholder'] ?? ''),
                        'type' => ($field['type'] ?? 'text') === 'select' ? 'select' : 'text',
                        'options' => collect($field['options'] ?? [])->map(fn ($option): array => [
                            'value' => (string) (is_array($option) ? ($option['value'] ?? '') : $option),
                            'label' => (string) (is_array($option) ? ($option['label'] ?? $option['value'] ?? '') : $option),
                        ])->values()->all(),
                    ])->values()->all();
                $product['packages'] = collect($items['payload'])->map(function (array $item): array {
                    if (! isset($item['id'], $item['name']) || ! is_numeric($item['total_price'] ?? null) || $item['total_price'] < 0) {
                        throw new \UnexpectedValueException('Invalid supplier item.');
                    }

                    return [
                        'id' => (string) $item['id'],
                        'name' => $item['name'],
                        'price' => (float) $item['total_price'],
                        'stock' => $item['stock'] ?? null,
                    ];
                })->values()->all();
                $prices = array_column($product['packages'], 'price');
                $product['minPrice'] = $prices ? min($prices) : null;
                $product['maxPrice'] = $prices ? max($prices) : null;

                return $product;
            });

            return response()->json(['product' => $result]);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'Game details are temporarily unavailable. Please try again.'], 503);
        }
    }

    public function submitSupport(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'order_number' => ['nullable', 'string', 'max:100'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
        ]);
        $id = DB::table('support_tickets')->insertGetId($data + ['status' => 'open', 'created_at' => now(), 'updated_at' => now()]);

        return response()->json(['id' => $id, 'message' => 'Support request received.'], 201);
    }

    public function updateSupport(Request $request, int $id): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        abort_unless(DB::table('support_tickets')->where('id', $id)->exists(), 404);
        $data = $request->validate([
            'status' => ['required', Rule::in(['open', 'pending', 'resolved', 'closed'])],
            'priority' => ['required', Rule::in(['low', 'normal', 'urgent'])],
            'admin_note' => ['nullable', 'string', 'max:10000'],
            'admin_reply' => ['nullable', 'string', 'max:10000'],
        ]);
        DB::table('support_tickets')->where('id', $id)->update($data + ['responded_at' => $data['admin_reply'] ? now() : null, 'updated_at' => now()]);

        return response()->json(['message' => 'Support ticket updated.']);
    }

    public function news(): JsonResponse
    {
        return response()->json(['news' => DB::table('news')->latest('published_at')->get()->map(fn ($row) => $this->newsPayload($row))]);
    }

    public function newsPost(string $slug): JsonResponse
    {
        $post = DB::table('news')->where('slug', $slug)->first();
        abort_if(! $post, 404);

        return response()->json(['post' => $this->newsPayload($post)]);
    }

    public function save(Request $request, ?int $id = null): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        if ($id !== null) {
            abort_unless(DB::table('products')->where('id', $id)->exists(), 404);
        }
        $data = $request->validate(['name' => ['required', 'string', 'max:200'], 'slug' => ['required', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:200', Rule::unique('products', 'slug')->ignore($id)], 'category' => ['required', 'string', 'max:80'], 'picture' => ['required', 'string', 'max:2000', 'regex:~^(https?://|/(?!/))~'], 'description' => ['required', 'string', 'max:10000'], 'minPrice' => ['required', 'numeric', 'min:0.01', 'max:1000000'], 'maxPrice' => ['required', 'numeric', 'gte:minPrice', 'max:1000000'], 'isGiftCard' => ['required', 'boolean']]);
        $existing = $id ? json_decode(DB::table('products')->where('id', $id)->value('data'), true) : ['rating' => 0, 'reviewsCount' => 0, 'discountTag' => null];
        $packageData = $request->validate([
            'packages' => ['sometimes', 'array', 'max:200'],
            'packages.*' => ['array:id,name,price'],
            'packages.*.id' => ['required', 'string', 'max:100', 'distinct'],
            'packages.*.name' => ['required', 'string', 'max:200'],
            'packages.*.price' => ['required', 'numeric', 'min:0.01', 'max:1000000', 'decimal:0,2'],
        ]);
        $data = array_merge($data, $packageData);
        $packages = $data['packages'] ?? $existing['packages'] ?? [];
        if (count($packages) > 0) {
            $data['minPrice'] = min(array_column($packages, 'price'));
            $data['maxPrice'] = max(array_column($packages, 'price'));
        }
        $values = ['slug' => $data['slug'], 'data' => json_encode(array_merge($existing, $data), JSON_THROW_ON_ERROR), 'updated_at' => now()];
        if ($id) {
            DB::table('products')->where('id', $id)->update($values);
        } else {
            $id = DB::table('products')->insertGetId($values + ['created_at' => now()]);
        }

        return response()->json(['id' => $id], $request->isMethod('post') ? 201 : 200);
    }

    public function account(Request $request): JsonResponse
    {
        $id = $request->user()->id;
        $orders = $this->accountOrders($id);

        if (! DB::connection()->getSchemaBuilder()->hasTable('wallet_entries')) {
            $balances = DB::table('balances')->where('user_id', $id);
            $entries = DB::table('balance_histories as h')
                ->join('balances as b', 'b.id', '=', 'h.balance_id')
                ->where('b.user_id', $id)->orderByDesc('h.id')->limit(100)
                ->get(['h.id', 'h.description', 'h.amount', 'h.created_at'])
                ->map(fn ($entry): array => [
                    'id' => $entry->id, 'description' => $entry->description,
                    'amount_centavos' => (int) round($entry->amount * 100), 'created_at' => $entry->created_at,
                ]);
            return response()->json(['orders' => $orders, 'walletEntries' => $entries, 'balanceCentavos' => (int) round($balances->sum('amount') * 100)]);
        }

        return response()->json(['orders' => $orders, 'walletEntries' => DB::table('wallet_entries')->where('user_id', $id)->latest()->limit(100)->get(), 'balanceCentavos' => (int) DB::table('wallet_entries')->where('user_id', $id)->sum('amount_centavos')]);
    }

    private function accountOrders(int $userId): mixed
    {
        $schema = DB::connection()->getSchemaBuilder();
        $orders = DB::table('orders as o')
            ->leftJoin('product_items as i', 'i.id', '=', 'o.product_item_id')
            ->leftJoin('products as p', 'p.id', '=', 'i.product_id')
            ->leftJoin('payment_methods as pm', 'pm.id', '=', 'o.payment_method_id')
            ->where('o.user_id', $userId)
            ->latest('o.id')
            ->limit(100)
            ->get(['o.id', 'o.code', 'o.status', 'o.total_price', 'o.currency_code', 'o.payment_id', 'o.payment_code', 'o.payment_url', 'o.payment_descriptor', 'o.provider', 'o.provider_ref', 'o.cust_account', 'o.note', 'o.created_at', 'o.updated_at', 'i.name as denomination', 'p.name as game', 'pm.name as payment_method']);
        $history = $schema->hasTable('order_histories')
            ? DB::table('order_histories')->whereIn('order_id', $orders->pluck('id'))->orderBy('created_at')->orderBy('id')->get(['id', 'order_id', 'status', 'type', 'note', 'created_at'])->groupBy('order_id')
            : collect();

        return $orders->map(function (object $order) use ($history): array {
            $status = strtolower((string) $order->status);
            $paymentStatus = in_array($status, ['success', 'completed'], true) ? 'paid' : (in_array($status, ['failed', 'refunded', 'expired'], true) ? $status : 'pending');
            $deliveryStatus = in_array($status, ['success', 'completed'], true) ? 'completed' : (in_array($status, ['on-process', 'processing'], true) ? 'processing' : $status);

            return [
                'id' => $order->id,
                'number' => $order->code,
                'game' => $order->game,
                'denomination' => $order->denomination,
                'status' => $status,
                'paymentStatus' => $paymentStatus,
                'deliveryStatus' => $deliveryStatus,
                'paymentMethod' => $order->payment_method ?: $order->payment_descriptor,
                'paymentId' => $order->payment_id,
                'paymentCode' => $order->payment_code,
                'paymentUrl' => $order->payment_url,
                'supplier' => $order->provider,
                'supplierReference' => $order->provider_ref,
                'account' => $order->cust_account,
                'note' => $order->note,
                'amount_centavos' => (int) round((float) $order->total_price * 100),
                'currency_code' => $order->currency_code ?: 'PHP',
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'history' => $history->get($order->id, collect())->values()->all(),
            ];
        });
    }

    public function admin(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $schema = DB::connection()->getSchemaBuilder();
        $columns = array_intersect(['id', 'name', 'email', 'is_admin', 'is_affiliate', 'is_streamer', 'is_auction', 'is_disabled', 'banned_at', 'created_at'], $schema->getColumnListing('users'));
        $users = User::select($columns)->latest()->limit(100)->get()->map(fn ($user): array => [
            'id' => $user->id, 'name' => $user->name, 'email' => $user->email,
            'is_admin' => $user->is_admin, 'is_affiliate' => (bool) $user->is_affiliate,
            'is_streamer' => (bool) $user->is_streamer, 'is_auction' => (bool) $user->is_auction,
            'is_disabled' => (bool) $user->is_disabled || $user->banned_at !== null,
            'created_at' => $user->created_at,
            'role_ids' => $schema->hasTable('model_has_roles') ? DB::table('model_has_roles')->where('model_type', $user->getMorphClass())->where('model_id', $user->id)->pluck('role_id')->all() : [],
        ]);
        $missing = array_values(array_filter(['news', 'support_tickets', 'payments'], fn (string $table): bool => ! $schema->hasTable($table)));

        return response()->json([
            'users' => $users,
            'roles' => $schema->hasTable('roles') ? DB::table('roles')->where('guard_name', 'web')->get(['id', 'name']) : [],
            'userProgramFlagsSupported' => $schema->hasColumns('users', ['is_affiliate', 'is_streamer', 'is_auction']),
            'news' => $schema->hasTable('news') ? DB::table('news')->latest('published_at')->limit(100)->get()->map(fn ($row) => $this->newsPayload($row)) : [],
            'support' => $schema->hasTable('support_tickets') ? DB::table('support_tickets')->latest()->limit(100)->get() : [],
            'orders' => DB::table('orders')->latest()->limit(100)->get(),
            'payments' => $schema->hasTable('payments') ? DB::table('payments')->latest()->limit(100)->get() : [],
            'unavailableTables' => $missing,
            'counts' => ['users' => DB::table('users')->count(), 'orders' => DB::table('orders')->count(), 'revenueCentavos' => $schema->hasTable('payments') ? (int) DB::table('payments')->where('status', 'completed')->sum('amount_centavos') : null],
        ]);
    }

    public function report(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $filters = $request->validate(['month' => ['required', 'integer', 'between:1,12'], 'year' => ['required', 'integer', 'between:2000,2100']]);
        $start = CarbonImmutable::create($filters['year'], $filters['month'], 1, 0, 0, 0, 'Asia/Manila')->utc();
        $end = $start->setTimezone('Asia/Manila')->addMonth()->utc();
        $today = CarbonImmutable::now('Asia/Manila')->startOfDay()->utc();
        $summarize = function ($from, $to): array {
            return ['orders' => DB::table('orders')->where('created_at', '>=', $from)->where('created_at', '<', $to)->count(), 'turnoverCentavos' => DB::connection()->getSchemaBuilder()->hasTable('payments') ? (int) DB::table('payments')->where('status', 'completed')->where('updated_at', '>=', $from)->where('updated_at', '<', $to)->sum('amount_centavos') : null];
        };

        return response()->json(['period' => $summarize($start, $end), 'today' => $summarize($today, $today->addDay()), 'pending' => DB::table('orders')->where('status', 'pending')->count(), 'users' => DB::table('users')->count(), 'newUsers' => DB::table('users')->where('created_at', '>=', $start)->where('created_at', '<', $end)->count(), 'products' => DB::table('products')->count()]);
    }

    private function orderQuery(): Builder
    {
        return DB::table('orders as o')
            ->leftJoin('users as u', 'u.id', '=', 'o.user_id')
            ->leftJoin('product_items as i', 'i.id', '=', 'o.product_item_id')
            ->leftJoin('products as p', 'p.id', '=', 'i.product_id')
            ->select('o.id', 'o.code', 'o.status', 'o.qty', 'o.total_price', 'o.currency_code', 'o.created_at', 'o.updated_at', 'u.name as customer_name', 'o.cust_email as customer_email', 'p.name as game', 'i.name as denomination');
    }

    public function orderList(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $data = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['pending', 'on-process', 'success', 'failed', 'delay', 'expired', 'refunded'])],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);
        $query = $this->orderQuery();
        if (! empty($data['status'])) {
            $query->where('o.status', $data['status']);
        }
        if (! empty($data['search'])) {
            $search = '%'.$data['search'].'%';
            $query->where(function ($query) use ($search): void {
                $query->where('o.code', 'like', $search)->orWhere('o.cust_email', 'like', $search)
                    ->orWhere('u.name', 'like', $search)->orWhere('p.name', 'like', $search);
            });
        }

        return response()->json($query->orderByDesc('o.id')->paginate(25, ['*'], 'page', (int) ($data['page'] ?? 1)));
    }

    public function orderDetails(Request $request, int $id): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $order = $this->orderQuery()->addSelect('o.cust_account', 'o.provider', 'o.provider_ref')->where('o.id', $id)->first();
        abort_unless($order, 404);

        return response()->json([
            'order' => $order,
            'history' => DB::table('order_histories')->where('order_id', $id)->orderBy('created_at')->orderBy('id')->get(['id', 'status', 'type', 'note', 'created_at']),
        ]);
    }

    public function saveNews(Request $request, ?int $id = null): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:255', Rule::unique('news', 'slug')->ignore($id)],
            'category' => ['required', Rule::in(['Esports', 'Patch Notes', 'Guides', 'News'])],
            'author' => ['required', 'string', 'max:255'],
            'read_time' => ['required', 'string', 'max:50'],
            'image' => ['required', 'string', 'max:2000', 'regex:~^(https?://|/(?!/))~'],
            'summary' => ['required', 'string', 'max:1000'],
            'content' => ['required', 'array', 'min:1'],
            'content.*' => ['required', 'string', 'max:10000'],
            'tags' => ['required', 'array', 'min:1'],
            'tags.*' => ['required', 'string', 'max:50'],
            'published_at' => ['required', 'date'],
        ]);
        $values = ['slug' => $data['slug'], 'title' => $data['title'], 'category' => $data['category'], 'author' => $data['author'], 'read_time' => $data['read_time'], 'image' => $data['image'], 'summary' => $data['summary'], 'content' => json_encode(array_values($data['content']), JSON_THROW_ON_ERROR), 'tags' => json_encode(array_values($data['tags']), JSON_THROW_ON_ERROR), 'published_at' => $data['published_at'], 'updated_at' => now()];
        if ($id) {
            abort_unless(DB::table('news')->where('id', $id)->exists(), 404);
            DB::table('news')->where('id', $id)->update($values);
        } else {
            $id = DB::table('news')->insertGetId($values + ['created_at' => now()]);
        }

        return response()->json(['id' => $id], $id && $request->isMethod('post') ? 201 : 200);
    }

    public function deleteNews(Request $request, int $id): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);
        abort_unless(DB::table('news')->where('id', $id)->delete(), 404);

        return response()->json(null, 204);
    }

    private function newsPayload(object $row): array
    {
        return ['id' => (string) $row->id, 'slug' => $row->slug, 'title' => $row->title, 'category' => $row->category, 'author' => $row->author, 'date' => date('M d, Y', strtotime($row->published_at)), 'readTime' => $row->read_time, 'image' => $row->image, 'summary' => $row->summary, 'content' => json_decode($row->content, true), 'tags' => json_decode($row->tags, true)];
    }

    private function cleanDescription(?string $description): string
    {
        $description = $description ?? '';
        $description = preg_replace('~<(style|script)\\b[^>]*>.*?</\\1>~is', '', $description) ?? $description;

        return trim(html_entity_decode(strip_tags($description), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $target = DB::table('users')->where('id', $id)->first();
        abort_if(! $target, 404);
        abort_if($target->id === $request->user()->id && $request->boolean('is_disabled'), 422, 'You cannot disable your own administrator account.');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'is_affiliate' => ['required', 'boolean'],
            'is_streamer' => ['required', 'boolean'],
            'is_auction' => ['required', 'boolean'],
            'is_disabled' => ['required', 'boolean'],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => ['integer', 'distinct', Rule::exists('roles', 'id')->where('guard_name', 'web')],
            'password' => ['nullable', 'string', 'confirmed', Password::defaults()],
        ]);

        $schema = DB::connection()->getSchemaBuilder();
        $updates = collect($data)->except(['password', 'role_ids'])->all();
        foreach (['is_affiliate', 'is_streamer', 'is_auction'] as $flag) {
            if (! $schema->hasColumn('users', $flag)) {
                abort_if($data[$flag], 422, 'Program membership changes are not yet supported for the imported database.');
                unset($updates[$flag]);
            }
        }
        if (! $schema->hasColumn('users', 'is_disabled')) {
            unset($updates['is_disabled']);
            $updates['banned_at'] = $data['is_disabled'] ? ($target->banned_at ?? now()) : null;
        }
        if (isset($data['role_ids']) && (int) $target->id === (int) $request->user()->id) {
            $adminRole = DB::table('roles')->where('name', 'Super Admin')->where('guard_name', 'web')->value('id');
            abort_unless(in_array((int) $adminRole, array_map('intval', $data['role_ids']), true), 422, 'You cannot remove your own administrator role.');
        }
        if (! empty($data['password'])) {
            $updates['password'] = Hash::make($data['password']);
        }
        $updates['updated_at'] = now();
        DB::transaction(function () use ($id, $updates, $data): void {
            DB::table('users')->where('id', $id)->update($updates);
            if (isset($data['role_ids'])) {
                $type = (new User)->getMorphClass();
                DB::table('model_has_roles')->where('model_id', $id)->where('model_type', $type)->delete();
                foreach ($data['role_ids'] as $roleId) {
                    DB::table('model_has_roles')->insert(['model_id' => $id, 'model_type' => $type, 'role_id' => $roleId]);
                }
            }
        });

        return response()->json(['message' => 'User updated successfully.']);
    }
}
