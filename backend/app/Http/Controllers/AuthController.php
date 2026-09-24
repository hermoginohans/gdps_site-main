<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Password as PasswordBroker;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function availability(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'field' => ['required', 'in:name,email'],
            'value' => ['required', 'string', 'max:255'],
        ]);

        if ($validated['field'] === 'email') {
            $request->validate(['value' => ['email']]);
        }

        return response()->json([
            'available' => ! User::where($validated['field'], $validated['value'])->exists(),
        ])->header('Cache-Control', 'no-store');
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:users,name'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'name.unique' => 'This nickname is already used.',
            'email.unique' => 'This email is already used.',
        ]);

        $userColumns = Schema::getColumnListing('users');
        $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        if (in_array('account_status', $userColumns, true)) $userData['account_status'] = 'active';
        if (in_array('first_login', $userColumns, true)) $userData['first_login'] = false;
        if (in_array('is_admin', $userColumns, true)) $userData['is_admin'] = false;
        if (in_array('loyalty_points', $userColumns, true)) $userData['loyalty_points'] = 0;
        $userId = DB::table('users')->insertGetId($userData);
        $user = User::findOrFail($userId);

        return response()->json(['user' => $this->profile($user), 'token' => $user->createToken('web')->plainTextToken], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 422);
        }

        if ($user->is_disabled) {
            return response()->json(['message' => 'This account has been disabled. Contact support for help.'], 403);
        }

        return response()->json(['user' => $this->profile($user), 'token' => $user->createToken('web')->plainTextToken]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate(['email' => ['required', 'email']]);
        $status = PasswordBroker::sendResetLink(['email' => $validated['email']]);

        if ($status !== PasswordBroker::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)], 422);
        }

        return response()->json(['message' => 'Password reset instructions have been sent.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);
        $status = PasswordBroker::reset($validated, function (User $user, string $password): void {
            $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
        });

        if ($status !== PasswordBroker::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 422);
        }

        return response()->json(['message' => 'Password reset successfully.']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->profile($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }

    public function googleRedirect(): RedirectResponse
    {
        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return redirect()->to(rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/').'/login?oauth=not-configured');
        }

        return Socialite::driver('google')->redirect();
    }

    public function googleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if (! $user) {
                $user = User::create([
                    'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: 'GPDS Gamer',
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(40)),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                $user->forceFill([
                    'google_id' => $user->google_id ?: $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar() ?: $user->avatar,
                ])->save();
            }

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->to(rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/').'/dashboard');
        } catch (\Throwable $exception) {
            report($exception);

            return redirect()->to(rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/').'/login?oauth=failed');
        }
    }

    private function profile(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => ($user->getAttributes()['avatar'] ?? null) ?: 'https://ui-avatars.com/api/?name='.urlencode($user->name).'&background=F0C030&color=151125',
            'vipTier' => 'Bronze',
            'loyaltyPoints' => (int) ($user->getAttributes()['loyalty_points'] ?? 0),
            'isAdmin' => (bool) ($user->getAttributes()['is_admin'] ?? false),
            'savedAccounts' => [],
        ];
    }
}
