<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GpaCalculation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GpaController extends Controller
{
    /**
     * Get all GPA calculations for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $calculations = GpaCalculation::where('user_id', $user->id)
            ->orderBy('academic_year', 'desc')
            ->orderBy('semester', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $calculations
        ]);
    }

    /**
     * Calculate and save GPA
     */
    public function calculate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'semester' => 'required|string|max:50',
            'academic_year' => 'required|string|max:20',
            'grade_scale' => 'required|in:4.0,5.0',
            'courses' => 'required|array|min:1',
            'courses.*.course_code' => 'required|string|max:20',
            'courses.*.course_name' => 'required|string|max:100',
            'courses.*.credit_hours' => 'required|numeric|min:0.5|max:10',
            'courses.*.grade' => 'required|string|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $courses = $request->courses;
        $gradeScale = $request->grade_scale;

        // Calculate GPA
        $calculation = GpaCalculation::calculateGPA($courses, $gradeScale);

        // Save to database
        $gpaCalculation = GpaCalculation::create([
            'user_id' => $user->id,
            'semester' => $request->semester,
            'academic_year' => $request->academic_year,
            'courses' => $courses,
            'total_credit_hours' => $calculation['total_credit_hours'],
            'total_grade_points' => $calculation['total_grade_points'],
            'gpa' => $calculation['gpa'],
            'grade_scale' => $gradeScale
        ]);

        return response()->json([
            'success' => true,
            'message' => 'GPA calculated successfully',
            'data' => [
                'calculation' => $gpaCalculation,
                'gpa_breakdown' => $calculation
            ]
        ]);
    }

    /**
     * Get a specific GPA calculation
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $calculation = GpaCalculation::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$calculation) {
            return response()->json([
                'success' => false,
                'message' => 'GPA calculation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $calculation
        ]);
    }

    /**
     * Update a GPA calculation
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        $calculation = GpaCalculation::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$calculation) {
            return response()->json([
                'success' => false,
                'message' => 'GPA calculation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'semester' => 'sometimes|string|max:50',
            'academic_year' => 'sometimes|string|max:20',
            'grade_scale' => 'sometimes|in:4.0,5.0',
            'courses' => 'sometimes|array|min:1',
            'courses.*.course_code' => 'required_with:courses|string|max:20',
            'courses.*.course_name' => 'required_with:courses|string|max:100',
            'courses.*.credit_hours' => 'required_with:courses|numeric|min:0.5|max:10',
            'courses.*.grade' => 'required_with:courses|string|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['semester', 'academic_year', 'grade_scale']);

        // Recalculate if courses are updated
        if ($request->has('courses')) {
            $courses = $request->courses;
            $gradeScale = $request->grade_scale ?? $calculation->grade_scale;
            
            $gpaData = GpaCalculation::calculateGPA($courses, $gradeScale);
            
            $updateData = array_merge($updateData, [
                'courses' => $courses,
                'total_credit_hours' => $gpaData['total_credit_hours'],
                'total_grade_points' => $gpaData['total_grade_points'],
                'gpa' => $gpaData['gpa']
            ]);
        }

        $calculation->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'GPA calculation updated successfully',
            'data' => $calculation
        ]);
    }

    /**
     * Delete a GPA calculation
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $calculation = GpaCalculation::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$calculation) {
            return response()->json([
                'success' => false,
                'message' => 'GPA calculation not found'
            ], 404);
        }

        $calculation->delete();

        return response()->json([
            'success' => true,
            'message' => 'GPA calculation deleted successfully'
        ]);
    }

    /**
     * Get GPA statistics for the user
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        
        $calculations = GpaCalculation::where('user_id', $user->id)->get();
        
        if ($calculations->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'total_calculations' => 0,
                    'average_gpa' => 0,
                    'highest_gpa' => 0,
                    'lowest_gpa' => 0,
                    'total_credit_hours' => 0
                ]
            ]);
        }

        $gpas = $calculations->pluck('gpa');
        $totalCreditHours = $calculations->sum('total_credit_hours');

        return response()->json([
            'success' => true,
            'data' => [
                'total_calculations' => $calculations->count(),
                'average_gpa' => round($gpas->avg(), 2),
                'highest_gpa' => $gpas->max(),
                'lowest_gpa' => $gpas->min(),
                'total_credit_hours' => $totalCreditHours,
                'recent_calculations' => $calculations->take(5)
            ]
        ]);
    }
}