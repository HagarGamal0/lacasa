<?php

namespace App\Http\Controllers\Api\User\Vendor;

use App\Exports\FinanceExport;
use App\Http\Controllers\Controller;
use App\Http\Helpers\PaginatorHelper;
use App\Models\PaymentMethod;
use App\Models\Sales\Order\OrderProduct;
use Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class FinanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $request_data = $request->validate([
            'vendor_id' => 'nullable|exists:vendors,user_id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
        ]);
        $equation = $this->calculate($request_data);

        return [
            'data' => [
                'statement' => PaginatorHelper::paginate($equation, 30),
                'calculation' => [
                    'total_vendor_income' => $equation->sum('vendor_revenue'),
                    'total_lacasa_income' => $equation->sum('commission'),
                    'to_be_transferred_to_lacasa' => $equation->where('payment_method', 'Cash On Delivery')->where('is_complete', 'No')->sum('commission'),
                    'to_be_transferred_to_vendor' => $equation->where('payment_method', '!=', 'Cash On Delivery')->where('is_complete', 'No')->sum('vendor_revenue'),
                ],
                'applied_filters' => $request->all(),
            ],
        ];
    }

    public function export(Request $request)
    {
        $request_data = $request->validate([
            'vendor_id' => 'nullable|exists:vendors,user_id',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
        ]);
        $equation = $this->calculate($request_data);

        return Excel::download(new FinanceExport($equation), 'Financial Sheet - ' . now() . '.csv', \Maatwebsite\Excel\Excel::CSV, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function calculate($request_data)
    {
        if (empty($request_data['from_date'])) {
            $request_data['from_date'] = Carbon::now()->startOfMonth()->format('Y-m-d H:i:s');
            $request_data['to_date'] = Carbon::now()->endOfMonth()->format('Y-m-d H:i:s');
        }
        if (Auth::user()->is_vendor()) {
            $vendor_id = Auth::id();
        } else {
            if (empty($request_data['vendor_id'])) {
                throw ValidationException::withMessages(['vendor_id' => 'vendor_id is required']);
            }
            $vendor_id = $request_data['vendor_id'];
        }
        $vendor_orders = OrderProduct::whereStatus('Delivered')->with('product')->whereHas('product', function (Builder $query) use ($vendor_id) {
            $query->where('vendor_id', $vendor_id);
        })->whereHas('order', function (Builder $query) use ($request_data) {
            $query->whereStatus('Complete')->whereBetween('created_at', [$request_data['from_date'], $request_data['to_date']]);
        })->get();
        // return $vendor_orders;
        // return $vendor_orders->first()->order->payment_method_id;
        $equation = $vendor_orders->map(function ($vendor_cod) use ($vendor_orders) {
            $payment = PaymentMethod::find($vendor_orders->first()->order->payment_method_id)->first();

            return [
                'order_id' => $vendor_cod['order_id'],
                'product' => [
                    'id' => $vendor_cod['product_id'],
                    'name' => $vendor_cod['product']['name'],
                    'slug' => $vendor_cod['product']['slug'],
                ],
                'date' => $vendor_orders->first()->order->created_at->format('d, M Y'),
                'payment_method' => $payment->display_name,
                'shipping_status' => $vendor_cod['status'],
                'commission' => $vendor_cod['commission'],
                'vendor_revenue' => $vendor_cod['vendor_revenue'],
                'subtotal' => $vendor_cod['subtotal'],
                'to_be_transferred_to_lacasa' => $payment->display_name == 'Cash On Delivery' ? $vendor_cod['commission'] : 0,
                'to_be_transferred_to_vendor' => $payment->display_name == 'Cash On Delivery' ? 0 : $vendor_cod['vendor_revenue'],
                'is_complete' => $vendor_cod['financed'] ? 'Paid' : 'Pending',
            ];
        });

        return $equation;
    }
}
