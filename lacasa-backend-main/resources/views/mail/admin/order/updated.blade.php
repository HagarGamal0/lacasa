@component('mail::message')
# Order #{{$order->id}}


{{$product->name}} status as been updated to {{$product->pivot->status}}.   
Please take a moment to review the order status below:   
  
@component('mail::table')
|  Product |  Status  |
|----------|:----:|
@foreach($order->products as $product)
|  {{$product->name}}   |  {{$product->pivot->status}}  |
@endforeach
@endcomponent

@component('mail::table')
| Order Status: | {{$order->status}} |
|:--------|--:|
@endcomponent

@component('mail::button', ['url' => config("app.dasboard_url").'/sales/order-inner-page/'.$order->id])
View Order Details
@endcomponent

<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>  
@endcomponent
