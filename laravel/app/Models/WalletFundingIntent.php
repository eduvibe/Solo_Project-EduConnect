<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WalletFundingIntent extends Model
{
    protected $fillable = [
        'parent_id',
        'amount_kobo',
        'reference',
        'status',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(WalletFundingPayment::class);
    }
}

