@component('mail::message')
# Hey {{$user->name}},  
Welcome to LaCasa,    
  
@component('mail::panel')
Your Registeration was succesful.  
@if($user->is_vendor())

We will contact you soon to confirm the approval of your account. 
in this while please prepare your products to be listed on LaCasa.  


@else

Hooray!, You can now shop between more than 5000+ Products.
  
@component('mail::button', ['url' => config('app.front_url').'/shop'])
SHOP NOW
@endcomponent

@endif
@endcomponent
      
      
<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>  
@endcomponent
