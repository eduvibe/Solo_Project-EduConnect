<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_intents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->string('kind', 16); // trial | subscription
            $table->unsignedInteger('duration_minutes')->default(60);
            $table->unsignedInteger('lessons_per_week')->nullable();
            $table->unsignedInteger('weeks')->default(4);
            $table->unsignedInteger('total_lessons');
            $table->string('day_of_week', 16)->nullable();
            $table->time('start_time')->nullable();
            $table->unsignedBigInteger('tutor_rate_kobo'); // hourly rate in kobo
            $table->unsignedBigInteger('amount_kobo'); // total amount due in kobo
            $table->string('reference', 32)->unique(); // e.g. PAY-XXXXXX
            $table->string('status', 24)->default('awaiting_payment'); // awaiting_payment | payment_submitted | approved | rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_intents');
    }
};

