<?php

namespace App\Exports;

// use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class FinanceExport implements FromView
{
    protected $equation;

    public function __construct($equation)
    {
        $this->equation = $equation;
    }

    public function view(): View
    {
        // return $this->filters['from_date'];
        return view('exports.finance_sheet', [
            'equations' => $this->equation,
        ]);
    }
}
