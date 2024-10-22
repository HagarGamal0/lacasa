@component('mail::message')
# {{__('lang.Hey')}} {{$user->name}},  
 {{__('lang.Welcome to LaCasa')}},    
  
@component('mail::panel')
@component('mail::button', ['url' =>$verificationUrl])
 {{__('lang.verified now')}}
@endcomponent

@endcomponent
<sup><a href="{{$siteUrl}}"> {{__('lang.go_to_website')}} </a></sup>  
@endcomponent
