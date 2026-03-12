<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('signed');
            $table->timestamps();
            $table->unique(['teacher_id', 'parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agreements');
    }
};

