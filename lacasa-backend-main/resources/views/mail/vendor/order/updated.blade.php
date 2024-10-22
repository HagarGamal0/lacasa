@component('mail::message')
# Order #{{$order->id}}

Your order has been updated. 
    
{{$product->name}} status as been updated to {{$product->pivot->status}}.   
Please take a moment to review your order status below:   
  
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

@component('mail::button', ['url' => config("app.front_url").'/page/account/dashboard?active=Orders'])
View Your Orders
@endcomponent

<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>  
@endcomponent
