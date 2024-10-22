<?php

namespace App\Mail\Admin\ContactUs;

use App\Models\Forms\ContactUs;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Recieved extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $contact;

    public function __construct(ContactUs $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('La Casa - Contact Us Message.')->markdown('mail.admin.contactus.recieved');
    }
}
