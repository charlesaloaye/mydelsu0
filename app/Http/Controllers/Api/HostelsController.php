<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HostelsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'hostels')
                ->with('user:id,first_name,last_name,email,phone')
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            }
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->input('min_price'));
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->input('max_price'));
            }
            if ($request->has('sort_by')) {
                switch ($request->input('sort_by')) {
                    case 'price-low':
                        $query->orderBy('price', 'asc');
                        break;
                    case 'price-high':
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
            }

            $hostels = $query->paginate($request->input('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $hostels->items(),
                'pagination' => [
                    'current_page' => $hostels->currentPage(),
                    'last_page' => $hostels->lastPage(),
                    'per_page' => $hostels->perPage(),
                    'total' => $hostels->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load hostels: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $hostel = MarketplaceItem::where('id', $id)
                ->where('category', 'hostels')
                ->with('user:id,first_name,last_name,email,phone')
                ->first();

            if (!$hostel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hostel not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $hostel,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load hostel: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'amenities' => 'required|string',
                'availability' => 'required|string',
                'images' => 'array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $hostelData = $request->only([
                'title',
                'description',
                'price',
                'location',
                'amenities',
                'availability'
            ]);
            $hostelData['user_id'] = auth()->id();
            $hostelData['category'] = 'hostels';

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('hostels', 'public');
                    $imagePaths[] = $path;
                }
                $hostelData['images'] = json_encode($imagePaths);
            }

            $hostel = MarketplaceItem::create($hostelData);

            return response()->json([
                'success' => true,
                'message' => 'Hostel created successfully',
                'data' => $hostel->load('user:id,first_name,last_name,email,phone'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create hostel: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $hostel = MarketplaceItem::where('id', $id)
                ->where('category', 'hostels')
                ->where('user_id', auth()->id())
                ->first();

            if (!$hostel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hostel not found or unauthorized',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'location' => 'sometimes|string|max:255',
                'amenities' => 'sometimes|string',
                'availability' => 'sometimes|string',
                'images' => 'sometimes|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $hostelData = $request->only([
                'title',
                'description',
                'price',
                'location',
                'amenities',
                'availability'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('hostels', 'public');
                    $imagePaths[] = $path;
                }
                $hostelData['images'] = json_encode($imagePaths);
            }

            $hostel->update($hostelData);

            return response()->json([
                'success' => true,
                'message' => 'Hostel updated successfully',
                'data' => $hostel->load('user:id,first_name,last_name,email,phone'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update hostel: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $hostel = MarketplaceItem::where('id', $id)
                ->where('category', 'hostels')
                ->where('user_id', auth()->id())
                ->first();

            if (!$hostel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hostel not found or unauthorized',
                ], 404);
            }

            $hostel->delete();

            return response()->json([
                'success' => true,
                'message' => 'Hostel deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete hostel: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function myHostels(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'hostels')
                ->where('user_id', auth()->id())
                ->orderBy('created_at', 'desc');

            $hostels = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $hostels->items(),
                'pagination' => [
                    'current_page' => $hostels->currentPage(),
                    'last_page' => $hostels->lastPage(),
                    'per_page' => $hostels->perPage(),
                    'total' => $hostels->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load hostels: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function contactOwner(Request $request, $id)
    {
        try {
            $hostel = MarketplaceItem::where('id', $id)
                ->where('category', 'hostels')
                ->first();

            if (!$hostel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hostel not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'message' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Here you would typically send an email or notification
            // For now, we'll just return success

            return response()->json([
                'success' => true,
                'message' => 'Message sent to hostel owner successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }
}
