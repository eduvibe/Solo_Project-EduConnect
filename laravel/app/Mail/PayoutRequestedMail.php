<?php

namespace App\Mail;

use App\Models\PayoutRequest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayoutRequestedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $tutor, public ?PayoutRequest $payout)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New payout request',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payout_requested',
            with: [
                'tutor' => $this->tutor,
                'payout' => $this->payout,
            ],
        );
    }
}

