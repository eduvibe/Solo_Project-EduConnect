<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        if (! class_exists(Category::class)) {
            return;
        }

        $categories = collect([
            ['name' => 'English tutors', 'slug' => 'english'],
            ['name' => 'Mathematics tutors', 'slug' => 'mathematics'],
            ['name' => 'Coding tutors', 'slug' => 'coding'],
            ['name' => 'Graphics design', 'slug' => 'graphics-design'],
            ['name' => 'Cyber security', 'slug' => 'cyber-security'],
            ['name' => 'UI/UX design', 'slug' => 'ui-ux-design'],
            ['name' => 'Hairmaking', 'slug' => 'hairmaking'],
            ['name' => 'Fashion design', 'slug' => 'fashion-design'],
            ['name' => 'IELTS prep', 'slug' => 'ielts'],
        ])->map(fn ($c) => Category::firstOrCreate(['slug' => $c['slug']], ['name' => $c['name']]));

        $teachers = User::factory()
            ->count(12)
            ->create()
            ->each(function (User $user) use ($categories) {
                $user->role = 'teacher';
                $user->save();

                $attachIds = $categories->random(rand(1, 3))->pluck('id')->all();
                $user->categories()->sync($attachIds);
            });
    }
}
