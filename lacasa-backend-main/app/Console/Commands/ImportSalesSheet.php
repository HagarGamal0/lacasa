<?php

namespace App\Console\Commands;

use App\Imports\SalesSheetImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportSalesSheet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales_sheet:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from sales sheet';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new SalesSheetImport, 'sales_sheet.csv', 'public');
        return Command::SUCCESS;
    }
}
