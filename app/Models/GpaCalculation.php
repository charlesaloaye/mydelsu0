<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GpaCalculation extends Model
{
    protected $fillable = [
        'user_id',
        'semester',
        'academic_year',
        'courses',
        'total_credit_hours',
        'total_grade_points',
        'gpa',
        'grade_scale'
    ];

    protected $casts = [
        'courses' => 'array',
        'total_credit_hours' => 'decimal:2',
        'total_grade_points' => 'decimal:2',
        'gpa' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function calculateGPA($courses, $gradeScale = '4.0')
    {
        $totalCreditHours = 0;
        $totalGradePoints = 0;

        foreach ($courses as $course) {
            $creditHours = $course['credit_hours'];
            $grade = $course['grade'];
            
            $gradePoints = self::getGradePoints($grade, $gradeScale);
            $totalCreditHours += $creditHours;
            $totalGradePoints += ($creditHours * $gradePoints);
        }

        $gpa = $totalCreditHours > 0 ? $totalGradePoints / $totalCreditHours : 0;

        return [
            'total_credit_hours' => $totalCreditHours,
            'total_grade_points' => $totalGradePoints,
            'gpa' => round($gpa, 2)
        ];
    }

    public static function getGradePoints($grade, $gradeScale = '4.0')
    {
        $gradeScale = $gradeScale === '5.0' ? '5.0' : '4.0';
        
        $gradePoints = [
            '4.0' => [
                'A+' => 4.0, 'A' => 4.0, 'A-' => 3.7,
                'B+' => 3.3, 'B' => 3.0, 'B-' => 2.7,
                'C+' => 2.3, 'C' => 2.0, 'C-' => 1.7,
                'D+' => 1.3, 'D' => 1.0, 'F' => 0.0
            ],
            '5.0' => [
                'A' => 5.0, 'B' => 4.0, 'C' => 3.0,
                'D' => 2.0, 'E' => 1.0, 'F' => 0.0
            ]
        ];

        return $gradePoints[$gradeScale][strtoupper($grade)] ?? 0.0;
    }
}
