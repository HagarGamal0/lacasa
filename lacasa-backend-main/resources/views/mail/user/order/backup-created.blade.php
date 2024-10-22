@component('mail::message')
# Order #{{$order->id}}

Your order has been created successfuly.  
Payment Method : {{$order->payment_method->display_name}} 
@component('mail::table')
|  Product |  Price  | Quantity | Subtotal  |
|----------|:-:|:-:|--:|
@foreach($order->products as $product)
|  {{$product->name}}  | {{$product->pivot->price/$product->pivot->quantity}} EGP  | {{$product->pivot->quantity}}   |  {{$product->pivot->subtotal-$product->pivot->shipping_fees}} EGP  |
@endforeach
@endcomponent

@component('mail::table')
| | |
|:--------|--:|
| Subtotal: | {{$order->subtotal}} EGP |
| Shipping Fees: | {{$order->shipping_fees}} EGP |
| {{$order->payment_method->display_name}} Fees: | 0 EGP |
@endcomponent

@component('mail::table')
| Total: | {{$order->total}} EGP |
|:--------|--:|
@endcomponent

@component('mail::button', ['url' => config("app.front_url").'/page/account/dashboard?active=Orders'])
View Your Orders
@endcomponent



<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>  
@endcomponent
