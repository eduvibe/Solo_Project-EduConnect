<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallet_funding_intents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('amount_kobo');
            $table->string('reference', 32)->unique();
            $table->string('status', 24)->default('awaiting_payment'); // awaiting_payment | payment_submitted | approved | rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_funding_intents');
    }
};

