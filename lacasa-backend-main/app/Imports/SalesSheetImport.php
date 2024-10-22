<?php

namespace App\Imports;

use App\Models\SalesSheet;
use App\Models\SalesSheetItem;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class SalesSheetImport implements ToCollection
{

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            try {
                SalesSheet::updateOrCreate([
                    'id' => $row[1]
                ], [
                    'order_date' => $row[2],
                    'customer_name' => $row[3],
                    'payment_method' => $row[4],
                    'status' => $row[5]
                ]);

                SalesSheetItem::create([
                    'sales_sheet_id' => $row[1],
                    'order_id' => $row[0],
                    'vendor_name' => $row[6],
                    'net' => $row[7],
                    'commission' => $row[8]
                ]);
            } catch (\Throwable $th) {
                dd($row);
            }
        }
    }
}
