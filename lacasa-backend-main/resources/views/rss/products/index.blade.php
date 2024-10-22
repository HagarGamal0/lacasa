<?=
/* Using an echo tag here so the `<? ... ?>` won't get parsed as short tags */
'<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL
?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Lacasa</title>
<link>https://lacasa-egy.com</link>
<description>Lacasa RSS Feeds</description>
@foreach($products as $product)
<item>
<g:id>{{$product->id}}</g:id>
<g:title>{{$product->name}}</g:title>
<g:description>{{ strip_tags($product->description)}}</g:description>
<g:link>{{config('app.front_url')}}/product-details/{{$product->slug}}</g:link>
<g:image_link>{{ $product->images()?->first()?->url }}</g:image_link>
<g:brand>LaCasa</g:brand>
<g:condition>new</g:condition>
<g:availability>in stock</g:availability>
<g:price>{{$product->price}}</g:price>
<g:sale_price>{{$product->price_after_sale}}</g:sale_price>
<g:google_product_category>{{$product->categories()?->first()?->name}}</g:google_product_category>
</item>
@endforeach
</channel>
</rss>
