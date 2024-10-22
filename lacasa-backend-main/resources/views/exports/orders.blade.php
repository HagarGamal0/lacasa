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
            <th>Tags</th>
            <th>Item Price</th>
            <th>quantity</th>
            <th>Shipping Fees</th>
            <th>Total Shipping Fees</th>
            <th>Shipped By</th>
            <th>Discounts</th>
            <th>Discount Details</th>
            <th>Coupon Name</th>
            <th>Coupon Value</th>
            <th>Online Payment</th>
            <th>Online Value</th>
            <th>Vendor Penality</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Lacasa Commission</th>
            <th>Vendor Revenue</th>
            <th>Date</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Area</th>
            <th>City</th>
            <th>Address</th>
            <th>User Orders</th>
            <th>Vendor Name</th>
            <th>Vendor Revenue</th>
            <th>Lacasa Commission</th>
            <th>Transaction ID</th>
            <th>Product Link</th>
            <th>Dashboard Product URL</th>
            <th>Dashboard Order URL</th>
        </tr>
    </thead>
    <tbody>

      @foreach($items as $item)
      <tr>
        <td>
          <a
            href="{{config('app.dashboard_url')}}/orders/detail/{{ $item->cart->orderable->id }}">{{ $item->cart->orderable->id }}</a>
        </td>
        <td>{{ $item->product->sku }}</td>
        <td>{{ $item->cart->orderable->payment_method->display_name }}</td>
        <td>{{ $item->status }}</td>
        <td>
          @foreach($item->product->categories->filter(function ($value, $key) {
              return $value->parent_id == null | $value->parent_id == 69;
          }) as $category) {{$category->name}} @if(!$loop->last)|@endif   @endforeach
        </td>
        <td>
          @foreach($item->product->categories->filter(function ($value, $key) {
            return $value->parent_id != null && $value->parent_id != 69;
        }) as $category)  {{$category->name}} @if(!$loop->last)|@endif   @endforeach
      </td>
      <td>{{ $item->product->name }}</td>
      <td>@foreach($item->attributes as $attribute)
        {{$attribute['attribute']}}: {{$attribute['value'] }}
        @if(!$loop->last) <br> @endif
        @endforeach
      </td>

      <td>
        @foreach($item->product->tags as $tag) {{$tag->name}} @if(!$loop->last)|@endif   @endforeach
      </td>

      <td>{{ $item->price }}</td>
      <td>{{ $item->quantity }}</td>
      <td>{{ $item->shipping_fees }}</td>
      <td>{{ $item->total_shipping_fees }}</td>
      <td>{{ $item->product->shipping_profile->provider?->name }}</td>
      <td>{{ $item->total_discounts }}</td>
      <td>
      @foreach($item->discounts as $key=>$discount)
        @if($discount['value'] > 0)
          {{ $key }} value:{{$discount['value']}}, description:({{$discount['description']}})
          @if(!$loop->last) <br> @endif
        @endif
      @endforeach
    </td>
      <td>{{isset($item->discounts['coupons']['description']) ? $item->discounts['coupons']['description'] :''}}</td>
      <td>{{isset($item->discounts['coupons']['value']) ? $item->discounts['coupons']['value'] :''}}</td>
      <td>{{ $item->cart->orderable->payment_method_id == 1 ? '' :  $item->cart->orderable->payment_method->display_name }}</td>
      <td>{{ $item->cart->orderable->payment_method_id == 1 ? '0' : $item->total }}</td>
      <td>0</td>
      <td>{{ ($item->price * $item->quantity) - $item->total_discounts }}</td>
      <td>{{ $item->total }}</td>
      <td>{{ $item->commission }}</td>
      <td>{{ $item->vendor_revenue }}</td>
      <td>{{ \Carbon\Carbon::parse($item->cart->orderable->created_at)->format('Y-m-d H:i:s') }}</td>
      <td>{{ $item->cart->orderable->address->first_name.' '.$item->cart->orderable->address->last_name }}</td>
      <td>{{ $item->cart->orderable->address->email }}</td>
      <td>{{ $item->cart->orderable->address->phone }}</td>
      <td>{{ $item->cart->orderable->address->area->name }}</td>
      <td>{{ $item->cart->orderable->address->area->city->name }}</td>
      <td>{{ $item->cart->orderable->address->address }}</td>
      <td>{{ $item->cart->orderable->user?->orders?->count() }}</td>
      <td>{{ $item->product->vendor->name }}</td>
      <td>{{ $item->vendor_revenue }}</td>
      <td>{{ $item->commission }}</td>
      <td>{{ $item->cart->orderable->payment_id }}</td>
      <td><a href="{{config('app.front_url')}}/product-details/{{$item->product->slug}}">{{config('app.front_url')}}/product-details/{{$item->product->slug}}</a></td>
      <td><a href="{{config('app.dashboard_url')}}/products/detail/{{$item->product->slug}}">{{config('app.dashboard_url')}}/products/detail/{{$item->product->slug}}</a></td>
      <td><a href="{{config('app.dashboard_url')}}/orders/detail/{{ $item->cart->orderable->id }}">{{config('app.dashboard_url')}}/orders/detail/{{ $item->cart->orderable->id }}</a></td>
      </tr>
      @endforeach
    </tbody>
</table>
