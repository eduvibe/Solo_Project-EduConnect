<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManualPayment extends Model
{
    protected $fillable = [
        'booking_intent_id',
        'parent_id',
        'amount_kobo',
        'payment_reference',
        'screenshot_path',
        'status',
        'admin_notes',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function bookingIntent(): BelongsTo
    {
        return $this->belongsTo(BookingIntent::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }
}

