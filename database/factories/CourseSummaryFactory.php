<?php

namespace Database\Factories;

use App\Models\CourseSummary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CourseSummary>
 */
class CourseSummaryFactory extends Factory
{
    protected $model = CourseSummary::class;

    public function definition(): array
    {
        $levels = ['100', '200', '300', '400', '500'];
        $semesters = ['1', '2'];
        $departments = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics'];
        $types = ['notes', 'summary', 'handout'];

        $courseCode = strtoupper(fake()->randomElement(['MTH', 'PHY', 'CHM', 'BIO', 'CSC', 'ECO'])) . fake()->numberBetween(101, 499);
        $courseTitle = fake()->sentence(3);

        return [
            'user_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'title' => $courseTitle . ' ' . fake()->randomElement(['Notes', 'Quick Guide', 'Handout']),
            'course_code' => $courseCode,
            'course_title' => $courseTitle,
            'level' => fake()->randomElement($levels),
            'semester' => fake()->randomElement($semesters),
            'session' => fake()->numberBetween(2018, 2025) . '/' . fake()->numberBetween(2019, 2026),
            'department' => fake()->randomElement($departments),
            'type' => fake()->randomElement($types),
            'description' => fake()->paragraph(),
            'file_path' => 'course-materials/course-summaries/' . strtolower($courseCode) . '-summary.pdf',
            'file_name' => strtolower($courseCode) . '-summary.pdf',
            'file_size' => fake()->numberBetween(200_000, 5_000_000),
            'file_type' => 'pdf',
            'price' => fake()->randomElement([0, 0, 0, 100, 200]),
            'status' => fake()->randomElement(['approved', 'approved', 'pending']),
            'admin_notes' => null,
            'download_count' => fake()->numberBetween(0, 500),
            'view_count' => fake()->numberBetween(0, 2000),
        ];
    }
}
