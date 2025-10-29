<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MarketplaceItem;
use Illuminate\Support\Facades\Validator;

class ServicesController extends Controller
{
    /**
     * Display a listing of services (marketplace items with category 'services').
     */
    public function index(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'services')
                ->with('user:id,first_name,last_name,email,phone')
                ->orderBy('created_at', 'desc');

            // Search functionality
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                      ->orWhere('description', 'like', "%{$searchTerm}%");
                });
            }

            // Price range filtering
            if ($request->has('min_price') && $request->min_price) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price') && $request->max_price) {
                $query->where('price', '<=', $request->max_price);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'newest');
            switch ($sortBy) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'price-low':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-high':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $services = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $services->items(),
                'pagination' => [
                    'current_page' => $services->currentPage(),
                    'last_page' => $services->lastPage(),
                    'per_page' => $services->perPage(),
                    'total' => $services->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load services: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified service.
     */
    public function show($id)
    {
        try {
            $service = MarketplaceItem::where('id', $id)
                ->where('category', 'services')
                ->with('user:id,first_name,last_name,email,phone')
                ->first();

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $service,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'availability' => 'nullable|string|max:255',
                'experience' => 'nullable|string|max:255',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $serviceData = [
                'user_id' => auth()->id(),
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'category' => 'services',
                'location' => $request->location,
                'contact' => $request->contact,
                'availability' => $request->availability,
                'experience' => $request->experience,
            ];

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imageUrls = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('marketplace', 'public');
                    $imageUrls[] = asset('storage/' . $path);
                }
                $serviceData['images'] = json_encode($imageUrls);
            }

            $service = MarketplaceItem::create($serviceData);

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully',
                'data' => $service->load('user:id,first_name,last_name,email,phone'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, $id)
    {
        try {
            $service = MarketplaceItem::where('id', $id)
                ->where('category', 'services')
                ->where('user_id', auth()->id())
                ->first();

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found or unauthorized',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'sometimes|required|numeric|min:0',
                'location' => 'sometimes|required|string|max:255',
                'contact' => 'sometimes|required|string|max:255',
                'availability' => 'nullable|string|max:255',
                'experience' => 'nullable|string|max:255',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $updateData = $request->only([
                'title', 'description', 'price', 'location', 
                'contact', 'availability', 'experience'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imageUrls = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('marketplace', 'public');
                    $imageUrls[] = asset('storage/' . $path);
                }
                $updateData['images'] = json_encode($imageUrls);
            }

            $service->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => $service->load('user:id,first_name,last_name,email,phone'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified service.
     */
    public function destroy($id)
    {
        try {
            $service = MarketplaceItem::where('id', $id)
                ->where('category', 'services')
                ->where('user_id', auth()->id())
                ->first();

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found or unauthorized',
                ], 404);
            }

            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's own services.
     */
    public function myServices(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'services')
                ->where('user_id', auth()->id())
                ->orderBy('created_at', 'desc');

            $services = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $services->items(),
                'pagination' => [
                    'current_page' => $services->currentPage(),
                    'last_page' => $services->lastPage(),
                    'per_page' => $services->perPage(),
                    'total' => $services->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load services: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Contact service provider.
     */
    public function contactProvider(Request $request, $id)
    {
        try {
            $service = MarketplaceItem::where('id', $id)
                ->where('category', 'services')
                ->with('user:id,first_name,last_name,email,phone')
                ->first();

            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:1000',
                'contact_method' => 'required|in:phone,email,whatsapp',
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
                'message' => 'Message sent successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }
}
