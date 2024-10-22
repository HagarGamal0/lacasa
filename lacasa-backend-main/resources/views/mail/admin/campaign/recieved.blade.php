@component('mail::message')
# You have recieved a campaign message from {{$campaign->name}},  
  

# Details:   
Name: {{$campaign->name}},   
Phone Number: {{$campaign->phone}},  
Email: {{$campaign->email}}. 

@component('mail::button', ['url' => 'mailto:'.$campaign->email])
Reply to {{$campaign->name}} 
@endcomponent



<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>
@endcomponent
