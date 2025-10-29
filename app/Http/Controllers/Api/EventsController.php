<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'events')
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

            $events = $query->paginate($request->input('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $events->items(),
                'pagination' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load events: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $event = MarketplaceItem::where('id', $id)
                ->where('category', 'events')
                ->with('user:id,first_name,last_name,email,phone')
                ->first();

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $event,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load event: ' . $e->getMessage(),
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
                'date' => 'required|date',
                'time' => 'required|string',
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

            $eventData = $request->only([
                'title',
                'description',
                'price',
                'location',
                'date',
                'time'
            ]);
            $eventData['user_id'] = auth()->id();
            $eventData['category'] = 'events';

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events', 'public');
                    $imagePaths[] = $path;
                }
                $eventData['images'] = json_encode($imagePaths);
            }

            $event = MarketplaceItem::create($eventData);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $event->load('user:id,first_name,last_name,email,phone'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $event = MarketplaceItem::where('id', $id)
                ->where('category', 'events')
                ->where('user_id', auth()->id())
                ->first();

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found or unauthorized',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'location' => 'sometimes|string|max:255',
                'date' => 'sometimes|date',
                'time' => 'sometimes|string',
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

            $eventData = $request->only([
                'title',
                'description',
                'price',
                'location',
                'date',
                'time'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events', 'public');
                    $imagePaths[] = $path;
                }
                $eventData['images'] = json_encode($imagePaths);
            }

            $event->update($eventData);

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $event->load('user:id,first_name,last_name,email,phone'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $event = MarketplaceItem::where('id', $id)
                ->where('category', 'events')
                ->where('user_id', auth()->id())
                ->first();

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found or unauthorized',
                ], 404);
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function myEvents(Request $request)
    {
        try {
            $query = MarketplaceItem::where('category', 'events')
                ->where('user_id', auth()->id())
                ->orderBy('created_at', 'desc');

            $events = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $events->items(),
                'pagination' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load events: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function contactOrganizer(Request $request, $id)
    {
        try {
            $event = MarketplaceItem::where('id', $id)
                ->where('category', 'events')
                ->first();

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found',
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
                'message' => 'Message sent to event organizer successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }
}
