<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->nullable()->constrained('agreements')->cascadeOnDelete();
            $table->foreignId('payer_id')->constrained('users')->cascadeOnDelete();   // parent
            $table->foreignId('tutor_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('amount_cents'); // gross
            $table->unsignedBigInteger('fee_cents')->default(0);
            $table->unsignedBigInteger('net_cents')->default(0);
            $table->string('status')->default('held'); // held -> cleared
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

