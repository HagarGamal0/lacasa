@component('mail::message')
# Dear #{{$products[0]->vendor->name}}

You have recieved the following order.
Payment Method : {{$order->payment_method->display_name}}
@component('mail::table')
| Product | Quantity | Total | Revenue |
|----------|:-:|:-:|--:|
@foreach($products as $product)
| {{$product->name}} | {{$product->pivot->quantity}} |{{$product->pivot->subtotal}} EGP |
{{$product->pivot->vendor_revenue}} EGP |
@endforeach
@endcomponent

@component('mail::table')
| | |
|:--------|--:|
| Order Total: | {{$products->sum('pivot.subtotal')}} EGP |
| La Casa Commission: | {{$products->sum('pivot.commission')}} EGP |
| Total Revenue: | {{$products->sum('pivot.vendor_revenue')}} EGP |
@endcomponent


# Shipping Details:
Name: {{$order->address->name}},
Address: {{$order->address->address}},
Area: {{$order->address->area->name}},
City: {{$order->address->city->name}},
Contact No.: {{$order->address->phone}}.

@component('mail::button', ['url' => config("app.front_url").'/page/vendor/vendor-dashboard?active=4'])
View All Orders
@endcomponent



<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>
@endcomponent