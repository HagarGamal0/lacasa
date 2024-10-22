@component('mail::message')
# You have recieved a contact message from {{$contact->first_name}},  
  

# Details:   
Name: {{$contact->first_name}} {{$contact->last_name}},   
Message: {{$contact->message}},   
Phone Number: {{$contact->phone}},  
Email: {{$contact->email}}. 

@component('mail::button', ['url' => 'mailto:'.$contact->email])
Reply to {{$contact->first_name}} 
@endcomponent



<sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>
@endcomponent
