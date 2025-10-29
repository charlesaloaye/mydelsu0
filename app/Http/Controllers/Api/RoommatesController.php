<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class RoommatesController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'roommates')
                ->with('user:id,first_name,last_name,email,phone')
                ->orderBy('created_at', 'desc');

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

            $items = $query->paginate($request->input('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $items->items(),
                'pagination' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load roommate listings: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $item = MarketplaceItem::where('id', $id)
                ->where('category', 'roommates')
                ->with('user:id,first_name,last_name,email,phone')
                ->first();

            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Roommate listing not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $item,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load roommate listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'nullable|numeric|min:0',
                'location' => 'required|string|max:255',
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

            $data = $request->only(['title', 'description', 'price', 'location']);
            $data['user_id'] = Auth::id();
            $data['category'] = 'roommates';

            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('roommates', 'public');
                    $imagePaths[] = $path;
                }
                $data['images'] = $imagePaths; // casted to array in model
            }

            $item = MarketplaceItem::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Roommate listing created successfully',
                'data' => $item->load('user:id,first_name,last_name,email,phone'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create roommate listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function myListings(Request $request)
    {
        try {
            $items = MarketplaceItem::where('category', 'roommates')
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $items->items(),
                'pagination' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load listings: ' . $e->getMessage(),
            ], 500);
        }
    }
}
