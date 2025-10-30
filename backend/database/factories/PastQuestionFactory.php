<?php

namespace Database\Factories;

use App\Models\PastQuestion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PastQuestion>
 */
class PastQuestionFactory extends Factory
{
    protected $model = PastQuestion::class;

    public function definition(): array
    {
        $levels = ['100', '200', '300', '400', '500'];
        $semesters = ['1', '2'];
        $departments = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics'];

        $courseCode = strtoupper(fake()->randomElement(['MTH', 'PHY', 'CHM', 'BIO', 'CSC', 'ECO'])) . fake()->numberBetween(101, 499);
        $courseTitle = fake()->sentence(3);

        return [
            'user_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'course_code' => $courseCode,
            'course_title' => $courseTitle,
            'level' => fake()->randomElement($levels),
            'semester' => fake()->randomElement($semesters),
            'session' => fake()->numberBetween(2018, 2025) . '/' . fake()->numberBetween(2019, 2026),
            'department' => fake()->randomElement($departments),
            'description' => fake()->paragraph(),
            'file_path' => 'course-materials/past-questions/' . strtolower($courseCode) . '.pdf',
            'file_name' => strtolower($courseCode) . '.pdf',
            'file_size' => fake()->numberBetween(150_000, 3_000_000),
            'file_type' => 'pdf',
            'price' => fake()->randomElement([0, 0, 0, 100, 200]),
            'status' => fake()->randomElement(['approved', 'approved', 'pending']),
            'admin_notes' => null,
            'download_count' => fake()->numberBetween(0, 500),
            'view_count' => fake()->numberBetween(0, 2000),
        ];
    }
}
