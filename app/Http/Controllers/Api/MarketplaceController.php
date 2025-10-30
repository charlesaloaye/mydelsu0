<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\MarketplaceItem;
use App\Models\User;

class MarketplaceController extends Controller
{
    /**
     * Get all marketplace items with filters
     */
    public function index(Request $request)
    {
        try {
            $query = MarketplaceItem::with('user')
                ->where('status', 'active')
                ->orderBy('created_at', 'desc');

            // Filter by category
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Search by title or description
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                        ->orWhere('description', 'like', "%{$searchTerm}%");
                });
            }

            // Filter by price range
            if ($request->has('min_price') && is_numeric($request->min_price)) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price') && is_numeric($request->max_price)) {
                $query->where('price', '<=', $request->max_price);
            }

            // Sort options
            $sortBy = $request->get('sort_by', 'newest');
            switch ($sortBy) {
                case 'price_low':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_high':
                    $query->orderBy('price', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $items = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $items->items(),
                'pagination' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch marketplace items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single marketplace item
     */
    public function show($id)
    {
        try {
            $item = MarketplaceItem::with('user')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $item
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Marketplace item not found'
            ], 404);
        }
    }

    /**
     * Create a new marketplace item
     */
    public function store(Request $request)
    {
        try {
            // Enforce: Only verified users can post marketplace items
            $authUser = Auth::user();
            if (!$authUser || !$authUser->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can post products/services.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'price' => 'required|numeric|min:0',
                'category' => 'required|in:for-sale,hostels,services,jobs',
                'location' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120' // 5MB max per image
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $uploadedImages = [];

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('marketplace', $filename, 'public');
                    $uploadedImages[] = Storage::url($path);
                }
            }

            $item = MarketplaceItem::create([
                'user_id' => $user->id,
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'category' => $request->category,
                'location' => $request->location,
                'contact' => $request->contact,
                'status' => 'active',
                'images' => $uploadedImages
            ]);

            $item->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Marketplace item created successfully',
                'data' => $item
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create marketplace item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a marketplace item
     */
    public function update(Request $request, $id)
    {
        try {
            // Enforce: Only verified users can update their marketplace items
            $authUser = Auth::user();
            if (!$authUser || !$authUser->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can update products/services.'
                ], 403);
            }

            $item = MarketplaceItem::where('user_id', Auth::id())->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string|max:1000',
                'price' => 'sometimes|required|numeric|min:0',
                'category' => 'sometimes|required|in:for-sale,hostels,services,jobs',
                'location' => 'sometimes|required|string|max:255',
                'contact' => 'sometimes|required|string|max:255',
                'status' => 'sometimes|in:active,inactive,sold',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only([
                'title',
                'description',
                'price',
                'category',
                'location',
                'contact',
                'status'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $uploadedImages = [];
                foreach ($request->file('images') as $image) {
                    $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('marketplace', $filename, 'public');
                    $uploadedImages[] = Storage::url($path);
                }
                $updateData['images'] = $uploadedImages;
            }

            $item->update($updateData);

            $item->load('user');

            return response()->json([
                'success' => true,
                'message' => 'Marketplace item updated successfully',
                'data' => $item
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update marketplace item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a marketplace item
     */
    public function destroy($id)
    {
        try {
            // Enforce: Only verified users can delete their marketplace items
            $authUser = Auth::user();
            if (!$authUser || !$authUser->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can delete products/services.'
                ], 403);
            }

            $item = MarketplaceItem::where('user_id', Auth::id())->findOrFail($id);
            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'Marketplace item deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete marketplace item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's marketplace items
     */
    public function myItems(Request $request)
    {
        try {
            $query = MarketplaceItem::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $items = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $items->items(),
                'pagination' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch your marketplace items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Contact seller
     */
    public function contactSeller(Request $request, $id)
    {
        try {
            $item = MarketplaceItem::with('user')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:500',
                'contact_method' => 'required|in:phone,email,whatsapp'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Here you would typically send an email or notification
            // For now, we'll just return success

            return response()->json([
                'success' => true,
                'message' => 'Message sent to seller successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to contact seller',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get marketplace categories
     */
    public function categories()
    {
        $categories = [
            'for-sale' => 'For Sale',
            'hostels' => 'Hostels',
            'services' => 'Services',
            'jobs' => 'Jobs'
        ];

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}
