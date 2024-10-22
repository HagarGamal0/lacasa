@component('mail::message')
    # You have recieved a new Service Request {{$request->name}},

    # Request Details:
    Designer: {{$request->designer->user->name}}}
    Project Sector => {{$request->project_sector}}
    Project Location => {{$request->project_location}}
    Project Area => $request->project_area,

    Name: {{$request->name}},
    Email: {{$request->email}},
    Communication Email: {{$request->email_communication}},
    Communication Phone: {{$request->phone_communication}},
    Communication Whatsapp: {{$request->whatsapp_communication}},
    City: {{$request->name}},
    Contact No.: {{$request->phone}}.
    10 to 5am: {{$request->f_10_to_5_am}}
    5 to 10am: {{$request->f_5_to_10_am}}
    10 to 5pm: {{$request->f_10_to_5_pm}}
    5to 10pm: {{$request->f_5_to_10_pm}}

    <sup>If you no longer want to recieve messages from us, <a href="#.">Unsubscribe.</a></sup>
@endcomponent
