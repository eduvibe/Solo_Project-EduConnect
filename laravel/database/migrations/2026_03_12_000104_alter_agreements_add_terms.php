<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('agreements', function (Blueprint $table) {
            $table->unsignedBigInteger('hourly_rate_cents')->default(0)->after('status');
            $table->unsignedInteger('sessions_count')->default(0)->after('hourly_rate_cents');
            $table->unsignedBigInteger('total_cents')->default(0)->after('sessions_count');
            $table->string('pay_day')->nullable()->after('total_cents');
            $table->boolean('accepted_by_teacher')->default(false)->after('pay_day');
            $table->timestamp('accepted_at')->nullable()->after('accepted_by_teacher');
            $table->unsignedInteger('service_fee_bps')->default(1000)->after('accepted_at'); // 1000 = 10.00%
        });
    }

    public function down(): void
    {
        Schema::table('agreements', function (Blueprint $table) {
            $table->dropColumn([
                'hourly_rate_cents',
                'sessions_count',
                'total_cents',
                'pay_day',
                'accepted_by_teacher',
                'accepted_at',
                'service_fee_bps',
            ]);
        });
    }
};

