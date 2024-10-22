@component('mail::message')
# Hi {{$user->name}},  
We received a request to reset your {{ config('app.name') }} password.  
Enter the following password recovery link:  
@component('mail::panel')
<div style="font-size:12px">
<a href="{{config('app.front_url')}}/page/account/reset?token={{$user->reset_token}}">{{config('app.front_url')}}/reset?token={{$user->reset_token}}</a>   
</div>
@endcomponent
      
      
<sup>If you didn't request to reset your password, Please ignore this email.</sup>  

Thanks,<br>
{{ config('app.name') }} Support.  
@endcomponent
