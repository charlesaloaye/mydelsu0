<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload past question
     */
    public function uploadQuestion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_code' => 'required|string|max:10',
            'course_title' => 'required|string|max:255',
            'level' => 'required|in:100,200,300,400,500',
            'semester' => 'required|in:1,2',
            'session' => 'required|string|max:10',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'description' => 'nullable|string|max:1000',
            'price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Store file
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('past_questions', $filename, 'public');

        // Create upload record
        $upload = [
            'user_id' => $user->id,
            'type' => 'past_question',
            'course_code' => $request->course_code,
            'course_title' => $request->course_title,
            'level' => $request->level,
            'semester' => $request->semester,
            'session' => $request->session,
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => $file->getSize(),
            'description' => $request->description,
            'price' => $request->price ?? 0,
            'status' => 'pending_review'
        ];

        // Save to database (you'll need to create the appropriate model/table)
        // $pastQuestion = PastQuestion::create($upload);

        return response()->json([
            'success' => true,
            'message' => 'Past question uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'file_url' => Storage::url($path),
                'upload_id' => 'PQ_' . time() . '_' . $user->id
            ]
        ]);
    }

    /**
     * Upload project
     */
    public function uploadProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_title' => 'required|string|max:255',
            'project_type' => 'required|in:thesis,dissertation,research,assignment',
            'department' => 'required|string|max:100',
            'level' => 'required|in:100,200,300,400,500',
            'abstract' => 'required|string|max:2000',
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480', // 20MB max
            'keywords' => 'nullable|string|max:500',
            'price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Store file
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('projects', $filename, 'public');

        // Create upload record
        $upload = [
            'user_id' => $user->id,
            'type' => 'project',
            'project_title' => $request->project_title,
            'project_type' => $request->project_type,
            'department' => $request->department,
            'level' => $request->level,
            'abstract' => $request->abstract,
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => $file->getSize(),
            'keywords' => $request->keywords,
            'price' => $request->price ?? 0,
            'status' => 'pending_review'
        ];

        return response()->json([
            'success' => true,
            'message' => 'Project uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'file_url' => Storage::url($path),
                'upload_id' => 'PROJ_' . time() . '_' . $user->id
            ]
        ]);
    }

    /**
     * Upload hostel information
     */
    public function uploadHostel(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hostel_name' => 'required|string|max:255',
            'hostel_type' => 'required|in:male,female,mixed',
            'location' => 'required|string|max:255',
            'price_range' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:100',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120', // 5MB max per image
            'availability' => 'required|in:available,not_available,coming_soon'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Store images
        $imagePaths = [];
        foreach ($request->file('images') as $image) {
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('hostels', $filename, 'public');
            $imagePaths[] = $path;
        }

        // Create upload record
        $upload = [
            'user_id' => $user->id,
            'type' => 'hostel',
            'hostel_name' => $request->hostel_name,
            'hostel_type' => $request->hostel_type,
            'location' => $request->location,
            'price_range' => $request->price_range,
            'description' => $request->description,
            'amenities' => json_encode($request->amenities ?? []),
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,
            'image_paths' => json_encode($imagePaths),
            'availability' => $request->availability,
            'status' => 'pending_review'
        ];

        return response()->json([
            'success' => true,
            'message' => 'Hostel information uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'image_urls' => array_map(fn($path) => Storage::url($path), $imagePaths),
                'upload_id' => 'HOSTEL_' . time() . '_' . $user->id
            ]
        ]);
    }

    /**
     * Get user uploads
     */
    public function getUserUploads(Request $request)
    {
        $user = $request->user();
        $type = $request->get('type', 'all'); // all, past_question, project, hostel

        // This would query the appropriate model based on type
        // For now, return mock data
        $uploads = [
            'past_questions' => [],
            'projects' => [],
            'hostels' => []
        ];

        return response()->json([
            'success' => true,
            'data' => $uploads
        ]);
    }

    /**
     * Delete upload
     */
    public function deleteUpload(Request $request, $id)
    {
        $user = $request->user();

        // Find and delete upload
        // This would query the appropriate model
        // For now, return success

        return response()->json([
            'success' => true,
            'message' => 'Upload deleted successfully'
        ]);
    }

    /**
     * Update upload status (admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending_review,approved,rejected',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update upload status
        // This would update the appropriate model

        return response()->json([
            'success' => true,
            'message' => 'Upload status updated successfully'
        ]);
    }
}
