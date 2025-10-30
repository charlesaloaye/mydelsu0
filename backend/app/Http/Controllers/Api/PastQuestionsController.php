<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PastQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PastQuestionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PastQuestion::with('user')
            ->where('status', 'approved');

        // Filter by level
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        // Filter by session
        if ($request->has('session')) {
            $query->where('session', $request->session);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('course_code', 'like', "%{$search}%")
                    ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        $pastQuestions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $pastQuestions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_code' => 'required|string|max:10',
            'course_title' => 'required|string|max:255',
            'level' => 'required|in:100,200,300,400,500',
            'semester' => 'required|in:1,2',
            'session' => 'required|string|max:10',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        // Store file
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('past_questions', $filename, 'public');

        $pastQuestion = PastQuestion::create([
            'user_id' => $user->id,
            'course_code' => $request->course_code,
            'course_title' => $request->course_title,
            'level' => $request->level,
            'semester' => $request->semester,
            'session' => $request->session,
            'department' => $request->department,
            'description' => $request->description,
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientMimeType(),
            'price' => $request->price ?? 0,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Past question uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'id' => $pastQuestion->id,
                'file_url' => Storage::url($path)
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pastQuestion = PastQuestion::with('user')
            ->where('status', 'approved')
            ->findOrFail($id);

        // Increment view count
        $pastQuestion->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $pastQuestion
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pastQuestion = PastQuestion::where('user_id', Auth::id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'course_code' => 'sometimes|required|string|max:10',
            'course_title' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|in:100,200,300,400,500',
            'semester' => 'sometimes|required|in:1,2',
            'session' => 'sometimes|required|string|max:10',
            'department' => 'nullable|string|max:100',
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

        $pastQuestion->update($request->only([
            'course_code',
            'course_title',
            'level',
            'semester',
            'session',
            'department',
            'description',
            'price'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Past question updated successfully',
            'data' => $pastQuestion
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pastQuestion = PastQuestion::where('user_id', Auth::id())->findOrFail($id);

        // Delete file from storage
        Storage::disk('public')->delete($pastQuestion->file_path);

        $pastQuestion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Past question deleted successfully'
        ]);
    }

    /**
     * Download the past question file
     */
    public function download(string $id)
    {
        $pastQuestion = PastQuestion::where('status', 'approved')->findOrFail($id);

        // Increment download count
        $pastQuestion->increment('download_count');

        return Storage::disk('public')->download($pastQuestion->file_path, $pastQuestion->file_name);
    }

    /**
     * Get past question statistics
     */
    public function stats()
    {
        $stats = [
            'total' => PastQuestion::where('status', 'approved')->count(),
            'by_level' => PastQuestion::where('status', 'approved')
                ->selectRaw('level, COUNT(*) as count')
                ->groupBy('level')
                ->pluck('count', 'level'),
            'by_department' => PastQuestion::where('status', 'approved')
                ->selectRaw('department, COUNT(*) as count')
                ->groupBy('department')
                ->pluck('count', 'department'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
