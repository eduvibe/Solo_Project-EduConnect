<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletFundingPayment extends Model
{
    protected $fillable = [
        'wallet_funding_intent_id',
        'parent_id',
        'amount_kobo',
        'payment_reference',
        'receipt_path',
        'status',
        'admin_notes',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function intent(): BelongsTo
    {
        return $this->belongsTo(WalletFundingIntent::class, 'wallet_funding_intent_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }
}

