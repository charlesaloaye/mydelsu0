<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'course_code',
        'level',
        'credit_unit',
        'semester',
        'score',
        'grade',
        'points'
    ];

    protected $casts = [
        'level' => 'integer',
        'credit_unit' => 'integer',
        'semester' => 'integer',
        'score' => 'integer',
        'points' => 'decimal:2'
    ];

    /**
     * Convert score to grade
     */
    public static function convertScoreToGrade($score)
    {
        if ($score >= 70) return 'A';
        if ($score >= 60) return 'B';
        if ($score >= 50) return 'C';
        if ($score >= 45) return 'D';
        return 'F';
    }

    /**
     * Get grade points
     */
    public static function getGradePoints($grade)
    {
        $gradePoints = [
            'A' => 5.00,
            'B' => 4.00,
            'C' => 3.00,
            'D' => 2.00,
            'F' => 0.00
        ];

        return $gradePoints[$grade] ?? 0.00;
    }

    /**
     * Calculate points for this course
     */
    public function calculatePoints()
    {
        return $this->credit_unit * self::getGradePoints($this->grade);
    }

    /**
     * Boot method to auto-calculate grade and points
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($course) {
            $course->grade = self::convertScoreToGrade($course->score);
            $course->points = $course->credit_unit * self::getGradePoints($course->grade);
        });

        static::updating(function ($course) {
            $course->grade = self::convertScoreToGrade($course->score);
            $course->points = $course->credit_unit * self::getGradePoints($course->grade);
        });
    }
}