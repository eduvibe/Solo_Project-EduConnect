<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DemoTutorsSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $teachers = [
            [
                'name' => 'Amaka Okafor',
                'email' => 'amaka.tutor@example.com',
                'location' => 'Lagos',
                'hourly_rate_cents' => 4500 * 100,
                'availability' => [
                    'monday' => ['enabled' => true, 'start' => '15:00', 'end' => '18:00'],
                    'tuesday' => ['enabled' => true, 'start' => '15:00', 'end' => '18:00'],
                    'wednesday' => ['enabled' => true, 'start' => '15:00', 'end' => '18:00'],
                    'thursday' => ['enabled' => true, 'start' => '15:00', 'end' => '18:00'],
                    'friday' => ['enabled' => true, 'start' => '15:00', 'end' => '18:00'],
                    'saturday' => ['enabled' => false, 'start' => '09:00', 'end' => '12:00'],
                    'sunday' => ['enabled' => false, 'start' => '09:00', 'end' => '12:00'],
                ],
                'tags' => ['mathematics', 'ielts'],
            ],
            [
                'name' => 'Ibrahim Musa',
                'email' => 'ibrahim.tutor@example.com',
                'location' => 'Abuja',
                'hourly_rate_cents' => 3500 * 100,
                'availability' => [
                    'monday' => ['enabled' => false, 'start' => '16:00', 'end' => '19:00'],
                    'tuesday' => ['enabled' => true, 'start' => '16:00', 'end' => '19:00'],
                    'wednesday' => ['enabled' => true, 'start' => '16:00', 'end' => '19:00'],
                    'thursday' => ['enabled' => true, 'start' => '16:00', 'end' => '19:00'],
                    'friday' => ['enabled' => true, 'start' => '16:00', 'end' => '19:00'],
                    'saturday' => ['enabled' => true, 'start' => '10:00', 'end' => '13:00'],
                    'sunday' => ['enabled' => false, 'start' => '10:00', 'end' => '13:00'],
                ],
                'tags' => ['english', 'ielts'],
            ],
        ];

        $categoryIdsBySlug = [];
        if (class_exists(Category::class) && Schema::hasTable('categories')) {
            foreach (collect($teachers)->pluck('tags')->flatten()->unique() as $slug) {
                $category = Category::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => ucwords(str_replace('-', ' ', (string) $slug)) . ' tutors']
                );
                $categoryIdsBySlug[(string) $slug] = $category->id;
            }
        }

        foreach ($teachers as $t) {
            $user = User::query()->updateOrCreate(
                ['email' => $t['email']],
                [
                    'name' => $t['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => $now,
                    'role' => 'teacher',
                    'location' => $t['location'],
                    'hourly_rate_cents' => $t['hourly_rate_cents'],
                    'availability' => $t['availability'],
                    'verification_status' => Schema::hasColumn('users', 'verification_status') ? 'approved' : null,
                    'verification_reviewed_at' => Schema::hasColumn('users', 'verification_reviewed_at') ? $now : null,
                ]
            );

            if (! empty($categoryIdsBySlug) && Schema::hasTable('category_user')) {
                $attach = collect($t['tags'])
                    ->map(fn ($slug) => $categoryIdsBySlug[(string) $slug] ?? null)
                    ->filter()
                    ->values()
                    ->all();
                if (! empty($attach)) {
                    $user->categories()->sync($attach);
                }
            }
        }
    }
}

