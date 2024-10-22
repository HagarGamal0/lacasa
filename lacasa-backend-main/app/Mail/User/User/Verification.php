<?php

namespace App\Mail\User\User;

use App\Models\User\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class Verification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $user;
    public $verificationUrl;
    public $siteUrl;

    public function __construct(User $user ,$from = 'login')
    {
        $this->user = $user;
        $this->verificationUrl = Url::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id,'from' => $from]
        );

        $this->siteUrl = config('app.front_url');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Welcome to La Casa Verfied Mail!')->markdown('mail.user.user.verification');
    }
}
