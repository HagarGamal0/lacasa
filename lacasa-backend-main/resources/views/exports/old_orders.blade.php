<table>
    <thead>
        <tr>
            <th>Order ID</th>
            <th>SKU</th>
            <th>Payment Method</th>
            <th>Item Status</th>
            <th>Item Main Categories</th>
            <th>Item Categories</th>
            <th>Item Name</th>
            <th>Variants</th>
            <th>Link</th>
            <th>Item Price</th>
            <th>quantity</th>
            <th>Purchase Price</th>
            <th>Subtotal</th>
            <th>Shipping Fees</th>
            <th>Coupon Discount</th>
            <th>Total</th>
            <th>Date</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Area</th>
            <th>City</th>
            <th>Address</th>
            <!-- <th>User Orders</th> -->
            <th>Vendor Name</th>
            <th>Vendor Revenue</th>
            <th>Lacasa Commission</th>
            <th>Payment Status</th>
            <th>Product Link</th>
            <th>Dashboard URL</th>
        </tr>
    </thead>
    <tbody>
        @foreach($products as $product)
        <tr>
            <td><a
                    href="{{config('app.dashboard_url')}}/sales/order-inner-page/{{ $product->cart?->order?->id }}">{{ $product->order->id }}</a>
            </td>
            <td>{{ $product->product->sku }}</td>
            <td>{{ $product->order->payment_method?->display_name }}</td>
            <td>{{ $product->status }}</td>
            <td>
              @foreach($product->product->categories->filter(function ($value, $key) {
                  return $value->parent_id == null | $value->parent_id == 69;
              }) as $category) {{$category->name}} @if(!$loop->last)|@endif   @endforeach 
            </td>
            <td>
              @foreach($product->product->categories->filter(function ($value, $key) {
                return $value->parent_id != null && $value->parent_id != 69;
            }) as $category)  {{$category->name}} @if(!$loop->last)|@endif   @endforeach
          </td>
            <td>{{ $product->product->name }}</td>
            <th>{{ str_replace(","," -", $product->attributes) }}</th>
            <td><a
                    href="{{config('app.front_url')}}/product-details/{{$product->product->slug}}">{{config('app.front_url')}}/product-details/{{$product->product->slug}}</a>
            </td>
            <td>{{ $product->price }}</td>
            <td>{{ $product->quantity }}</td>
            <td>{{ $product->purchase_price }}</td>
            <td>{{ $product->subtotal }}</td>
            <td>{{ $product->shipping_fees }}</td>
            <td>{{ $product->coupon_discount }}</td>
            <td>{{ $product->subtotal +  $product->shipping_fees}}</td>
            <td>{{ \Carbon\Carbon::parse($product->order->created_at)->format('Y-m-d H:i:s') }}</td>
            <td>{{ $product->order?->address?->first_name.' '.$product->order?->address?->last_name }}</td>
            <td>{{ $product->order?->address?->email }}</td>
            <td>{{ $product->order?->address?->phone }}</td>
            <td>{{ $product->order?->address?->area?->name }}</td>
            <td>{{ $product->order?->address?->area?->city?->name }}</td>
            <td>{{ $product->order?->address?->address }}</td>
            <!-- <td>{{ $product->order?->user?->orders?->count() }}</td> -->
            <td>{{ $product->product?->vendor?->name }}</td>
            <td>{{ $product->vendor_revenue }}</td>
            <td>{{ $product->commission }}</td>
            <td>{{ $product->order->payment_status }}</td>
            <td><a href="{{config('app.front_url')}}/product-details/{{$product->product->slug}}">{{config('app.front_url')}}/product-details/{{$product->product->slug}}</a></td>
            <td><a href="{{config('app.dashboard_url')}}/products/detail/{{$product->product->slug}}">{{config('app.dashboard_url')}}/products/detail/{{$product->product->slug}}</a></td>
            <td><a href="{{config('app.dashboard_url')}}/orders/old/detail/{{ $product->order->id }}">{{config('app.dashboard_url')}}/orders/old/detail/{{ $product->order->id }}</a></td>
        </tr>
        @endforeach
    </tbody>
</table>
