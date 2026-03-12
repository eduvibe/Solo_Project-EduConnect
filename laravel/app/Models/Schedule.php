<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Schedule extends Model
{
    protected $fillable = [
        'teacher_id',
        'title',
        'link',
        'day_of_week',
        'start_time',
        'recurring',
        'date',
        'status',
    ];

    protected $casts = [
        'recurring' => 'boolean',
        'date' => 'date',
        'start_time' => 'datetime:H:i',
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

