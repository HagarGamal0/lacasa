<table>
    <thead>
    <tr>
        <th>Product Item Id</th>
        <th>Title</th>
        <th>Description</th>
        <th>Item URL</th> 
        <th>Item Image</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Sale Price</th>
    </tr>
    </thead>
    <tbody>
    @foreach($products as $product)
        <tr>
          <td>{{ $product->id }}</td>
          <td>{{ Str::limit($product->name , 30, ' ...') }}</td>
          <td>{{ Str::limit($product->description , 122, ' ...') }}</td>
          <td>{{config('app.front_url')}}/product-details/{{$product->slug}}</td>
          <td>{{$product->images?->first()?->url}}</td>
          <td>{{ $product->price }}</td>
          <td>{{ $product->sku }}</td>
          <td>{{ $product->price_after_sale }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
