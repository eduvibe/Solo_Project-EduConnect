<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('profile_summary')->nullable()->after('verification_submitted_at');
            $table->string('location')->nullable()->after('profile_summary');
            $table->unsignedBigInteger('hourly_rate_cents')->default(0)->after('location');
            $table->json('availability')->nullable()->after('hourly_rate_cents');
            $table->string('avatar_path')->nullable()->after('availability');
            $table->string('id_document_path')->nullable()->after('avatar_path');
            $table->string('certificate_path')->nullable()->after('id_document_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_summary',
                'location',
                'hourly_rate_cents',
                'availability',
                'avatar_path',
                'id_document_path',
                'certificate_path',
            ]);
        });
    }
};

