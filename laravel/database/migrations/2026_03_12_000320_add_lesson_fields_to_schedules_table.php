<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('teacher_id')->constrained('users')->nullOnDelete();
            $table->foreignId('booking_intent_id')->nullable()->after('parent_id')->constrained('booking_intents')->nullOnDelete();
            $table->dateTime('scheduled_start')->nullable()->after('date');
            $table->unsignedInteger('duration_minutes')->default(60)->after('scheduled_start');
            $table->unsignedBigInteger('tutor_rate_kobo')->default(0)->after('duration_minutes');
            $table->unsignedInteger('commission_bps')->default(1000)->after('tutor_rate_kobo');
            $table->string('lesson_status', 32)->nullable()->after('status');
            $table->dateTime('auto_confirm_at')->nullable()->after('lesson_status');
            $table->dateTime('confirmed_at')->nullable()->after('auto_confirm_at');
            $table->text('issue_note')->nullable()->after('confirmed_at');

            $table->index(['parent_id', 'lesson_status']);
            $table->index(['teacher_id', 'lesson_status']);
            $table->index(['scheduled_start']);
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropIndex(['parent_id', 'lesson_status']);
            $table->dropIndex(['teacher_id', 'lesson_status']);
            $table->dropIndex(['scheduled_start']);
            $table->dropColumn([
                'parent_id',
                'booking_intent_id',
                'scheduled_start',
                'duration_minutes',
                'tutor_rate_kobo',
                'commission_bps',
                'lesson_status',
                'auto_confirm_at',
                'confirmed_at',
                'issue_note',
            ]);
        });
    }
};

