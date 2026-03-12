<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('linkedin_url')->nullable()->after('phone');
            $table->string('x_url')->nullable()->after('linkedin_url');
            $table->string('tiktok_url')->nullable()->after('x_url');
            $table->string('facebook_url')->nullable()->after('tiktok_url');

            $table->text('verification_rejection_note')->nullable()->after('verification_submitted_at');
            $table->foreignId('verification_reviewed_by')->nullable()->after('verification_rejection_note')->constrained('users')->nullOnDelete();
            $table->timestamp('verification_reviewed_at')->nullable()->after('verification_reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verification_reviewed_by');
            $table->dropColumn([
                'phone',
                'linkedin_url',
                'x_url',
                'tiktok_url',
                'facebook_url',
                'verification_rejection_note',
                'verification_reviewed_at',
            ]);
        });
    }
};

