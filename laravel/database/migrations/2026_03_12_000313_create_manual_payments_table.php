<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manual_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_intent_id')->constrained('booking_intents')->cascadeOnDelete();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('amount_kobo');
            $table->string('payment_reference', 100); // bank transaction reference
            $table->string('screenshot_path')->nullable();
            $table->string('status', 16)->default('pending'); // pending | approved | rejected
            $table->text('admin_notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manual_payments');
    }
};

