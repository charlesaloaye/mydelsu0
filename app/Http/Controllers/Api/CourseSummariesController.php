<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CourseSummariesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CourseSummary::with('user')
            ->where('status', 'approved');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by level
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('course_code', 'like', "%{$search}%")
                    ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        $courseSummaries = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $courseSummaries
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'course_code' => 'required|string|max:10',
            'course_title' => 'required|string|max:255',
            'level' => 'required|in:100,200,300,400,500',
            'semester' => 'required|in:1,2',
            'session' => 'required|string|max:10',
            'department' => 'nullable|string|max:100',
            'type' => 'required|in:notes,summary,handout',
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
        $path = $file->storeAs('course_summaries', $filename, 'public');

        $courseSummary = CourseSummary::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'course_code' => $request->course_code,
            'course_title' => $request->course_title,
            'level' => $request->level,
            'semester' => $request->semester,
            'session' => $request->session,
            'department' => $request->department,
            'type' => $request->type,
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
            'message' => 'Course summary uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'id' => $courseSummary->id,
                'file_url' => Storage::url($path)
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $courseSummary = CourseSummary::with('user')
            ->where('status', 'approved')
            ->findOrFail($id);

        // Increment view count
        $courseSummary->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $courseSummary
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $courseSummary = CourseSummary::where('user_id', Auth::id())->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'course_code' => 'sometimes|required|string|max:10',
            'course_title' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|in:100,200,300,400,500',
            'semester' => 'sometimes|required|in:1,2',
            'session' => 'sometimes|required|string|max:10',
            'department' => 'nullable|string|max:100',
            'type' => 'sometimes|required|in:notes,summary,handout',
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

        $courseSummary->update($request->only([
            'title',
            'course_code',
            'course_title',
            'level',
            'semester',
            'session',
            'department',
            'type',
            'description',
            'price'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Course summary updated successfully',
            'data' => $courseSummary
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $courseSummary = CourseSummary::where('user_id', Auth::id())->findOrFail($id);

        // Delete file from storage
        Storage::disk('public')->delete($courseSummary->file_path);

        $courseSummary->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course summary deleted successfully'
        ]);
    }

    /**
     * Download the course summary file
     */
    public function download(string $id)
    {
        $courseSummary = CourseSummary::where('status', 'approved')->findOrFail($id);

        // Increment download count
        $courseSummary->increment('download_count');

        return Storage::disk('public')->download($courseSummary->file_path, $courseSummary->file_name);
    }

    /**
     * Get course summary statistics
     */
    public function stats()
    {
        $stats = [
            'total' => CourseSummary::where('status', 'approved')->count(),
            'by_type' => CourseSummary::where('status', 'approved')
                ->selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'by_level' => CourseSummary::where('status', 'approved')
                ->selectRaw('level, COUNT(*) as count')
                ->groupBy('level')
                ->pluck('count', 'level'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Search course summaries via POST payload: { query, filters }
     */
    public function search(Request $request)
    {
        $queryBuilder = CourseSummary::with('user')
            ->where('status', 'approved');

        $search = $request->input('query');
        $filters = (array) $request->input('filters', []);

        if ($search) {
            $queryBuilder->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('course_code', 'like', "%{$search}%")
                    ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['type'])) {
            $queryBuilder->where('type', $filters['type']);
        }
        if (!empty($filters['level'])) {
            $queryBuilder->where('level', $filters['level']);
        }
        if (!empty($filters['department'])) {
            $queryBuilder->where('department', $filters['department']);
        }

        $results = $queryBuilder->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }
}
