<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookingIntent extends Model
{
    protected $fillable = [
        'parent_id',
        'tutor_id',
        'kind',
        'duration_minutes',
        'lessons_per_week',
        'weeks',
        'total_lessons',
        'day_of_week',
        'start_time',
        'tutor_rate_kobo',
        'amount_kobo',
        'reference',
        'status',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(ManualPayment::class);
    }
}

