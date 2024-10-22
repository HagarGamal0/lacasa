@component('mail::message')
    # You have recieved a new order from {{$order->user->name}},

    Payment Method : {{$order->payment_method->display_name}}
    @component('mail::table')
        | Product | Quantity | Vendors Income | Commission |
        |----------|:-:|:-:|--:|
        @foreach($order->products as $product)
            | {{$product->name}} | {{$product->pivot->quantity}} |{{$product->pivot->vendor_revenue}} EGP |
            {{$product->pivot->commission}} EGP |
        @endforeach
    @endcomponent

    @component('mail::table')
        | | |
        |:--------|--:|
        | Order Total: | {{$order->total}} EGP |
        | Vendors Revenue: | {{$order->vendor_revenue}} EGP |
        | La Casa Commission: | {{$order->commission}} EGP |
    @endcomponent


    # Shipping Details:
    Name: {{$order->address->name}},
    Address: {{$order->address->address}},
    Area: {{$order->address->area->name}},
    City: {{$order->address->city->name}},
    Contact No.: {{$order->address->phone}}.

    @component('mail::button', ['url' => config("app.dashboard_url").'/sales/order-inner-page/'.$order->id])
        View Order Details
    @endcomponent



    <sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>
@endcomponent
