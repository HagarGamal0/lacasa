<?php

namespace App\Http\Controllers\Datatable;

use App\Http\Controllers\Controller;
use App\Models\Sales\Order\Order;
use Yajra\DataTables\DataTables;
use DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::
        leftJoin('users', 'orders.user_id', '=', 'users.id')
        ->leftJoin('address_books', 'orders.address_book_id', '=', 'address_books.id')
        ->leftJoin('payment_methods', 'orders.payment_method_id', '=', 'payment_methods.id')
        ->leftJoin('carts', 'carts.orderable_id', '=', 'orders.id')
        ->select('carts.shipping_fees','carts.subtotal', 'carts.total', 'orders.id','orders.created_at','orders.payment_method_id','orders.status','users.name','address_books.phone as phone','payment_methods.display_name as payment_method', 'carts.id as cart_id')
        ->withCount('items')
        // ->get()
        ;
     
        return Datatables::of($orders)
          ->editColumn('orders.created_at', function ($user) {
              return $user->created_at ? $user->created_at->toDayDateTimeString() : '';
          })
          ->editColumn('updated_at', function ($user) {
              return $user->updated_at ? $user->updated_at->toDayDateTimeString() : '';;
          })
          ->editColumn('items_count', function ($query) {
              return $query->items_count.' Item(s)';
          })
          ->filterColumn('orders.created_at', function ($query, $keyword) {
              $query->whereRaw("DATE_FORMAT(created_at,'%m/%d/%Y') like ?", ["%$keyword%"]);
          })
          ->filterColumn('updated_at', function ($query, $keyword) {
              $query->whereRaw("DATE_FORMAT(updated_at,'%Y/%m/%d') like ?", ["%$keyword%"]);
          })
          ->filterColumn('name', function ($query, $keyword) {
              $query->where('users.name' ,'like', '%' . $keyword . '%');
          })
          ->filterColumn('phone', function ($query, $keyword) {
              $query->where('address_books.phone' ,'like', '%' . $keyword . '%');
          })
  
          ->filterColumn('payment_method', function ($query, $keyword) {
              $query->where('payment_methods.display_name', 'like', '%' . $keyword . '%');
          })
          ->filterColumn('cart.subtotal', function ($query, $keyword) {
              $query->where('cart.subtotal', 'like', '%' . $keyword . '%');
          })
          ->orderColumn('payment_method', function ($query, $order) {
              $query->orderBy('payment_method_id', $order);
          })
          
        ->make(true);
        
        
        
    //     { data: "created_at"},
    // {
    //   data: "shipping_details.consignee.name", "render": function (data, type, row) {
    //     return `<a href="/orders/detail/${row.id}">${data}</a>`;
    //   }
    // },
    // { data: "shipping_details.consignee.phone" },
    // { data: "id" },
    // 
    // { data: "payment_detail.shipping_fees"},
    // { data: "payment_detail.total"},
    // { data: "status"},
    // { data: "items.length"},
    // { data: "transaction_detail.type"},
    // { data: "payment_detail.subtotal"},
    }
}
