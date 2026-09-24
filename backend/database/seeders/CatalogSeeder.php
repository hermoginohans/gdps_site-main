<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $products = json_decode(file_get_contents(database_path('seeders/catalog.json')), true, 512, JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($products): void {
            foreach ($products as $product) {
                DB::table('products')->insertOrIgnore(['slug' => $product['slug'], 'data' => json_encode($product, JSON_THROW_ON_ERROR), 'created_at' => now(), 'updated_at' => now()]);
            }
        });
    }
}
