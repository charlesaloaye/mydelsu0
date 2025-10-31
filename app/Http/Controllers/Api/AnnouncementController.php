<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Traits\HasCacheableResponses;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AnnouncementController extends Controller
{
    use HasCacheableResponses;
    /**
     * Get all announcements for the current user
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $cacheKey = $this->getUserCacheKey('announcements:index', $user->id, [
                'per_page' => $request->get('per_page', 10),
                'type' => $request->get('type'),
                'priority' => $request->get('priority'),
                'search' => $request->get('search'),
                'page' => $request->get('page', 1)
            ]);

            // Cache for 10 minutes
            $result = $this->remember($cacheKey, function () use ($request, $user) {
                $perPage = $request->get('per_page', 10);
                $type = $request->get('type');
                $priority = $request->get('priority');
                $search = $request->get('search');

                $query = Announcement::with('creator')
                    ->active()
                    ->published()
                    ->notExpired()
                    ->forAudience('all', $user->department, $user->level ?? null)
                    ->orderBy('is_pinned', 'desc')
                    ->orderBy('priority', 'desc')
                    ->orderBy('created_at', 'desc');

                // Filter by type
                if ($type) {
                    $query->where('type', $type);
                }

                // Filter by priority
                if ($priority) {
                    $query->where('priority', $priority);
                }

                // Search
                if ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('content', 'like', "%{$search}%");
                    });
                }

                $announcements = $query->paginate($perPage);

                return [
                    'data' => $announcements->items(),
                    'pagination' => [
                        'current_page' => $announcements->currentPage(),
                        'last_page' => $announcements->lastPage(),
                        'per_page' => $announcements->perPage(),
                        'total' => $announcements->total(),
                    ]
                ];
            }, 600); // 10 minutes cache

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific announcement
     */
    public function show($id)
    {
        try {
            $announcement = Announcement::with('creator')
                ->active()
                ->published()
                ->notExpired()
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $announcement
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new announcement (Admin only)
     */
    public function store(Request $request)
    {
        try {
            // Check if user is admin
            $user = $request->user();
            if (!$this->isAdmin($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'type' => 'required|in:info,warning,important,success',
                'priority' => 'required|in:low,medium,high,urgent',
                'target_audience' => 'required|in:all,students,staff,specific_department',
                'department' => 'nullable|string|required_if:target_audience,specific_department',
                'level' => 'nullable|string',
                'is_pinned' => 'boolean',
                'publish_at' => 'nullable|date|after:now',
                'expires_at' => 'nullable|date|after:publish_at',
                'image_url' => 'nullable|url',
                'attachments' => 'nullable|array',
                'attachments.*' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $announcement = Announcement::create([
                'title' => $request->title,
                'content' => $request->content,
                'type' => $request->type,
                'priority' => $request->priority,
                'target_audience' => $request->target_audience,
                'department' => $request->department,
                'level' => $request->level,
                'is_pinned' => $request->boolean('is_pinned', false),
                'publish_at' => $request->publish_at ? Carbon::parse($request->publish_at) : null,
                'expires_at' => $request->expires_at ? Carbon::parse($request->expires_at) : null,
                'image_url' => $request->image_url,
                'attachments' => $request->attachments,
                'created_by' => $user->id,
            ]);

            // Clear announcement cache after creation
            Cache::flush(); // In production, consider more granular cache clearing

            return response()->json([
                'success' => true,
                'message' => 'Announcement created successfully',
                'data' => $announcement->load('creator')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an announcement (Admin only)
     */
    public function update(Request $request, $id)
    {
        try {
            // Check if user is admin
            $user = $request->user();
            if (!$this->isAdmin($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], 403);
            }

            $announcement = Announcement::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'content' => 'sometimes|required|string',
                'type' => 'sometimes|required|in:info,warning,important,success',
                'priority' => 'sometimes|required|in:low,medium,high,urgent',
                'target_audience' => 'sometimes|required|in:all,students,staff,specific_department',
                'department' => 'nullable|string|required_if:target_audience,specific_department',
                'level' => 'nullable|string',
                'is_active' => 'boolean',
                'is_pinned' => 'boolean',
                'publish_at' => 'nullable|date',
                'expires_at' => 'nullable|date|after:publish_at',
                'image_url' => 'nullable|url',
                'attachments' => 'nullable|array',
                'attachments.*' => 'string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $announcement->update($request->only([
                'title',
                'content',
                'type',
                'priority',
                'target_audience',
                'department',
                'level',
                'is_active',
                'is_pinned',
                'image_url',
                'attachments'
            ]));

            if ($request->has('publish_at')) {
                $announcement->publish_at = $request->publish_at ? Carbon::parse($request->publish_at) : null;
            }

            if ($request->has('expires_at')) {
                $announcement->expires_at = $request->expires_at ? Carbon::parse($request->expires_at) : null;
            }

            $announcement->save();

            // Clear announcement cache after update
            Cache::forget("announcements:show:{$id}");
            Cache::flush(); // In production, consider more granular cache clearing

            return response()->json([
                'success' => true,
                'message' => 'Announcement updated successfully',
                'data' => $announcement->load('creator')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an announcement (Admin only)
     */
    public function destroy($id)
    {
        try {
            // Check if user is admin
            $user = request()->user();
            if (!$this->isAdmin($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], 403);
            }

            $announcement = Announcement::findOrFail($id);
            $announcement->delete();

            // Clear announcement cache after deletion
            Cache::forget("announcements:show:{$id}");
            Cache::flush(); // In production, consider more granular cache clearing

            return response()->json([
                'success' => true,
                'message' => 'Announcement deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get announcement statistics (Admin only)
     */
    public function stats()
    {
        try {
            $user = request()->user();
            if (!$this->isAdmin($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], 403);
            }

            $stats = [
                'total' => Announcement::count(),
                'active' => Announcement::active()->count(),
                'pinned' => Announcement::pinned()->count(),
                'by_type' => Announcement::selectRaw('type, count(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type'),
                'by_priority' => Announcement::selectRaw('priority, count(*) as count')
                    ->groupBy('priority')
                    ->pluck('count', 'priority'),
                'this_month' => Announcement::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent announcements for dashboard
     */
    public function recent(Request $request)
    {
        try {
            $user = $request->user();
            $limit = $request->get('limit', 5);
            $cacheKey = $this->getUserCacheKey('announcements:recent', $user->id, ['limit' => $limit]);

            // Cache for 10 minutes
            $announcements = $this->remember($cacheKey, function () use ($user, $limit) {
                return Announcement::with('creator')
                    ->active()
                    ->published()
                    ->notExpired()
                    ->forAudience('all', $user->department, $user->level ?? null)
                    ->orderBy('is_pinned', 'desc')
                    ->orderBy('priority', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
            }, 600); // 10 minutes cache

            return response()->json([
                'success' => true,
                'data' => $announcements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user is admin
     */
    private function isAdmin($user)
    {
        // You can implement your admin check logic here
        // For now, we'll check if the user has a specific role or permission
        return $user->is_admin ?? false;
    }
}
