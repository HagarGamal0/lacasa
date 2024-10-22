<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>SKU</th>
            <th>Status</th>
            <th>Name</th>
            <th>Variants</th>
            <th>Original Price</th>
            <th>Price After Sale</th>
            <th>Main Categories</th>
            <th>Sub Categories</th>
            <th>Product Link</th>
            <th>Dashboard URL</th>
        </tr>
    </thead>
    <tbody>
        @foreach($products as $product)
        <tr>
            <td><a
                    href="{{config('app.dashboard_url')}}/sales/order-inner-page/{{ $product->id }}">{{ $product->id }}</a>
            </td>
            <td>{{ $product->vendor->name }}</td>
            <td>{{ $product->sku }}</td>
            <td>{{ $product->status }}</td>
            <td>{{ $product->name }}</td>
            <td>
              @foreach($product->attribute_values as $attribute_value)
                {{ $attribute_value->attribute->name }}: {{$attribute_value->value}} @if($attribute_value->pivot->price_after_sale > 0) (Price:{{$attribute_value->pivot->price_after_sale}}) @endif
                @if(!$loop->last) <br> @endif
              @endforeach
            </td>
            <td>{{ $product->price }}</td>
            <td>{{ $product->price_after_sale }}</td>
            <td>
              @foreach($product->categories->filter(function ($value, $key) {
                  return $value->parent_id == null | $value->parent_id == 69;
              }) as $category) {{$category->name}} @if(!$loop->last)|@endif   @endforeach
            </td>
            <td>
              @foreach($product->categories->filter(function ($value, $key) {
                return $value->parent_id != null && $value->parent_id != 69;
            }) as $category)  {{$category->name}} @if(!$loop->last)|@endif   @endforeach
          </td>
            <td><a href="{{config('app.front_url')}}/product-details/{{$product->slug}}">{{config('app.front_url')}}/product-details/{{$product->slug}}</a></td>
            <td><a href="{{config('app.dashboard_url')}}/products/detail/{{$product->slug}}">{{config('app.dashboard_url')}}/products/detail/{{$product->slug}}</a></td>

        </tr>
        @endforeach
    </tbody>
</table>
