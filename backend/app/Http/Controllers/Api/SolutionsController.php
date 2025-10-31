<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solution;
use App\Models\SolutionComment;
use App\Models\SolutionReview;
use App\Models\PastQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SolutionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Solution::with(['user', 'pastQuestion'])
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

        // Filter by course code
        if ($request->has('course_code')) {
            $query->where('course_code', $request->course_code);
        }

        // Filter by past question
        if ($request->has('past_question_id')) {
            $query->where('past_question_id', $request->past_question_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('course_code', 'like', "%{$search}%")
                    ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        $solutions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $solutions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'past_question_id' => 'nullable|exists:past_questions,id',
            'course_code' => 'required|string|max:10',
            'course_title' => 'required|string|max:255',
            'level' => 'required|in:100,200,300,400,500',
            'semester' => 'required|in:1,2',
            'session' => 'required|string|max:10',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
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
        $path = $file->storeAs('solutions', $filename, 'public');

        $solution = Solution::create([
            'user_id' => $user->id,
            'past_question_id' => $request->past_question_id ?? null,
            'course_code' => $request->course_code,
            'course_title' => $request->course_title,
            'level' => $request->level,
            'semester' => $request->semester,
            'session' => $request->session,
            'department' => $request->department ?? null,
            'description' => $request->description ?? null,
            'file_path' => $path,
            'file_name' => $filename,
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientMimeType(),
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solution uploaded successfully. It will be reviewed before being published.',
            'data' => [
                'id' => $solution->id,
                'file_url' => Storage::url($path),
                'upload_id' => 'SOL_' . time() . '_' . $user->id
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $solution = Solution::with(['user', 'pastQuestion', 'comments.user', 'reviews.user'])
            ->where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        // Check if user is authenticated and has premium subscription
        $user = Auth::user();
        if (!$user || !$user->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Premium subscription required to view solutions'
            ], 403);
        }

        // Increment view count
        $solution->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $solution
        ]);
    }

    /**
     * Get user's solutions
     */
    public function mySolutions(Request $request)
    {
        $user = Auth::user();

        $solutions = Solution::where('user_id', $user->id)
            ->with('pastQuestion')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $solutions
        ]);
    }

    /**
     * Download solution file
     */
    public function download($id)
    {
        $solution = Solution::where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        // Increment download count
        $solution->increment('download_count');

        if (!Storage::disk('public')->exists($solution->file_path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        $filePath = Storage::disk('public')->path($solution->file_path);

        return response()->download($filePath, $solution->file_name);
    }

    /**
     * Rate a solution (deprecated - use review instead)
     */
    public function rate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $solution = Solution::where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        $user = Auth::user();
        if (!$user || !$user->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Premium subscription required to rate solutions'
            ], 403);
        }

        // Check if user already has a review
        $existingReview = SolutionReview::where('solution_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingReview) {
            // Update existing review
            $existingReview->update([
                'rating' => $request->rating
            ]);
        } else {
            // Create new review
            SolutionReview::create([
                'solution_id' => $id,
                'user_id' => $user->id,
                'rating' => $request->rating
            ]);
        }

        // Calculate new average rating from all reviews
        $reviews = SolutionReview::where('solution_id', $id)->get();
        $totalRating = $reviews->sum('rating');
        $count = $reviews->count();
        $averageRating = $count > 0 ? $totalRating / $count : 0;

        $solution->update([
            'rating' => round($averageRating, 2),
            'rating_count' => $count
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solution rated successfully',
            'data' => [
                'rating' => $solution->rating,
                'rating_count' => $solution->rating_count
            ]
        ]);
    }

    /**
     * Add a comment to a solution
     */
    public function addComment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $solution = Solution::where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        $user = Auth::user();
        if (!$user || !$user->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Premium subscription required to comment on solutions'
            ], 403);
        }

        $comment = SolutionComment::create([
            'solution_id' => $id,
            'user_id' => $user->id,
            'comment' => $request->comment,
            'helpful_count' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment->load('user')
        ]);
    }

    /**
     * Add a review to a solution
     */
    public function addReview(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $solution = Solution::where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        $user = Auth::user();
        if (!$user || !$user->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Premium subscription required to review solutions'
            ], 403);
        }

        // Check if user already has a review
        $review = SolutionReview::updateOrCreate(
            [
                'solution_id' => $id,
                'user_id' => $user->id
            ],
            [
                'rating' => $request->rating,
                'review' => $request->review
            ]
        );

        // Calculate new average rating from all reviews
        $reviews = SolutionReview::where('solution_id', $id)->get();
        $totalRating = $reviews->sum('rating');
        $count = $reviews->count();
        $averageRating = $count > 0 ? $totalRating / $count : 0;

        $solution->update([
            'rating' => round($averageRating, 2),
            'rating_count' => $count
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review added successfully',
            'data' => $review->load('user')
        ]);
    }

    /**
     * Get comments for a solution
     */
    public function getComments($id)
    {
        $solution = Solution::where('id', $id)
            ->where('status', 'approved')
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found'
            ], 404);
        }

        $comments = SolutionComment::where('solution_id', $id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Mark a comment as helpful
     */
    public function markCommentHelpful(Request $request, $commentId)
    {
        $comment = SolutionComment::find($commentId);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found'
            ], 404);
        }

        $comment->increment('helpful_count');

        return response()->json([
            'success' => true,
            'message' => 'Comment marked as helpful',
            'data' => $comment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $solution = Solution::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found or you do not have permission to update it'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_code' => 'sometimes|string|max:10',
            'course_title' => 'sometimes|string|max:255',
            'level' => 'sometimes|in:100,200,300,400,500',
            'semester' => 'sometimes|in:1,2',
            'session' => 'sometimes|string|max:10',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $solution->update($request->only([
            'course_code',
            'course_title',
            'level',
            'semester',
            'session',
            'department',
            'description',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Solution updated successfully',
            'data' => $solution
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $solution = Solution::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$solution) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found or you do not have permission to delete it'
            ], 404);
        }

        // Delete file if exists
        if (Storage::disk('public')->exists($solution->file_path)) {
            Storage::disk('public')->delete($solution->file_path);
        }

        $solution->delete();

        return response()->json([
            'success' => true,
            'message' => 'Solution deleted successfully'
        ]);
    }
}
