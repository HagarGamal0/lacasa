<?php

namespace App\Console\Commands;

use App\Imports\OrdersUpdateImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class UpdateOrdersStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:sheet_update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update orders statuses from sheet';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new OrdersUpdateImport, 'update_sheet.csv', 'public');
        return Command::SUCCESS;
    }
}
