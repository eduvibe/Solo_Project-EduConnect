<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Schedule extends Model
{
    protected $fillable = [
        'teacher_id',
        'parent_id',
        'booking_intent_id',
        'title',
        'link',
        'day_of_week',
        'start_time',
        'recurring',
        'date',
        'scheduled_start',
        'duration_minutes',
        'tutor_rate_kobo',
        'commission_bps',
        'status',
        'lesson_status',
        'auto_confirm_at',
        'reminder_24h_sent_at',
        'reminder_1h_sent_at',
        'confirmed_at',
        'issue_note',
    ];

    protected $casts = [
        'recurring' => 'boolean',
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'scheduled_start' => 'datetime',
        'auto_confirm_at' => 'datetime',
        'reminder_24h_sent_at' => 'datetime',
        'reminder_1h_sent_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'schedule_user');
    }
}
