<?php

namespace App\Console\Commands;

use App\Models\Catalog\Product\Product;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class FixSlugCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-slug';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'fix duplication if products slug to make it unique';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $duplicated_slug = Product::groupBy('slug')->havingRaw('count(slug) > 1')->pluck('slug');
        $duplicated_products = Product::whereIn('slug', $duplicated_slug->toArray())->get()->groupBy->slug;
        $this->info('slug count => ' . $duplicated_slug->count());
        $duplicated_products->each(function (Collection $value) {
            foreach ($value->slice(1) as $product) {
                if (strlen($product->slug) > 254) {
                    $product->slug = \Str::before($product->slug , '-').'-' . $product->id;
                } else {
                    $product->slug .= '-' . $product->id;
                }
                $product->save();
            }
        });
        return Command::SUCCESS;
    }
}
