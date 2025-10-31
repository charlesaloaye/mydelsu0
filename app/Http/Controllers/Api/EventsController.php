<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventTicket;
use App\Models\PurchasedTicket;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Event::with(['user:id,first_name,last_name,email,phone', 'tickets'])
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->search($search);
            }

            if ($request->has('category')) {
                $query->byCategory($request->input('category'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->has('date')) {
                $query->where('date', $request->input('date'));
            }

            if ($request->has('sort_by')) {
                switch ($request->input('sort_by')) {
                    case 'date-asc':
                        $query->orderBy('date', 'asc');
                        break;
                    case 'date-desc':
                        $query->orderBy('date', 'desc');
                        break;
                    case 'newest':
                    default:
                        $query->orderBy('created_at', 'desc');
                        break;
                }
            }

            // Show sponsored events first
            $query->orderBy('sponsored', 'desc');

            $events = $query->paginate($request->input('per_page', 12));

            // Transform data to match frontend expectations
            $eventsData = $events->getCollection()->map(function ($event) {
                return $this->transformEvent($event);
            })->values()->all();

            return response()->json([
                'success' => true,
                'data' => $eventsData,
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
            $event = Event::with(['user:id,first_name,last_name,email,phone', 'tickets'])
                ->find($id);

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found',
                ], 404);
            }

            // Increment views
            $event->incrementViews();

            return response()->json([
                'success' => true,
                'data' => $this->transformEvent($event),
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
            // Enforce: Only verified users can post events
            $user = Auth::user();
            if (!$user || !$user->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can post events.'
                ], 403);
            }

            // Parse tickets from JSON string if needed, before validation
            $requestData = $request->all();

            // Log received data for debugging
            Log::info('Event creation request', [
                'tickets_raw' => $requestData['tickets'] ?? 'not set',
                'tickets_type' => isset($requestData['tickets']) ? gettype($requestData['tickets']) : 'not set',
                'all_keys' => array_keys($requestData),
            ]);

            // Handle tickets - can be JSON string or array
            if (isset($requestData['tickets'])) {
                if (is_string($requestData['tickets'])) {
                    $decodedTickets = json_decode($requestData['tickets'], true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decodedTickets)) {
                        $requestData['tickets'] = $decodedTickets;
                        Log::info('Tickets parsed from JSON', ['count' => count($decodedTickets)]);
                    } else {
                        Log::warning('Failed to parse tickets JSON', ['error' => json_last_error_msg()]);
                    }
                }
            } else {
                Log::warning('Tickets field not present in request');
            }

            // Handle sponsored - convert string "1"/"0" to boolean before validation
            if (isset($requestData['sponsored'])) {
                $sponsoredValue = $requestData['sponsored'];
                if ($sponsoredValue === '1' || $sponsoredValue === 1 || $sponsoredValue === 'true' || $sponsoredValue === true) {
                    $requestData['sponsored'] = true;
                } elseif ($sponsoredValue === '0' || $sponsoredValue === 0 || $sponsoredValue === 'false' || $sponsoredValue === false) {
                    $requestData['sponsored'] = false;
                }
            } else {
                $requestData['sponsored'] = false;
            }

            $validator = Validator::make($requestData, [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|in:Academic,Social/Parties,Sports,Career,Religious,Cultural,Entertainment,Workshop,Other',
                'date' => 'required|date',
                'time' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'tags' => 'array|max:5',
                'tags.*' => 'string|max:50',
                'sponsored' => 'boolean',
                'images' => 'array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'tickets' => 'required|array|min:1',
                'tickets.*.name' => 'required|string|max:255',
                'tickets.*.price' => 'required|numeric|min:0',
                'tickets.*.description' => 'nullable|string',
                'tickets.*.benefits' => 'array',
                'tickets.*.benefits.*' => 'string|max:255',
                'tickets.*.limited' => 'boolean',
                'tickets.*.slots_left' => 'nullable|integer|min:1',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                Log::warning('Event creation validation failed', [
                    'errors' => $errors->toArray(),
                    'tickets_in_request' => isset($requestData['tickets']) ? (is_array($requestData['tickets']) ? count($requestData['tickets']) . ' tickets' : gettype($requestData['tickets'])) : 'not set',
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors,
                ], 422);
            }

            $eventData = $request->only([
                'title',
                'description',
                'category',
                'date',
                'time',
                'location',
            ]);
            $eventData['user_id'] = Auth::id();
            $eventData['status'] = 'upcoming';

            // Handle sponsored - can be string "1"/"0" or boolean
            $sponsored = $request->input('sponsored');
            if ($sponsored === '1' || $sponsored === 1 || $sponsored === true) {
                $eventData['sponsored'] = true;
            } else {
                $eventData['sponsored'] = false;
            }

            // Handle tags - can come as array or JSON string
            if ($request->has('tags')) {
                if (is_string($request->input('tags'))) {
                    $tags = json_decode($request->input('tags'), true);
                    $eventData['tags'] = is_array($tags) ? $tags : [];
                } else {
                    $eventData['tags'] = $request->input('tags', []);
                }
            }

            // Handle image uploads
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events', 'public');
                    $imagePaths[] = asset('storage/' . $path);
                }
                $eventData['images'] = $imagePaths;
            }

            $event = Event::create($eventData);

            // Create tickets - already parsed before validation, but check again
            $ticketsData = $requestData['tickets'] ?? $request->input('tickets');
            if (is_string($ticketsData)) {
                $ticketsData = json_decode($ticketsData, true);
            }
            if (!is_array($ticketsData)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid tickets format',
                ], 422);
            }

            $tickets = [];
            $totalRevenue = 0;
            $totalSold = 0;

            foreach ($ticketsData as $ticketData) {
                // Handle both snake_case and camelCase field names
                $slotsLeft = $ticketData['slots_left'] ?? $ticketData['slotsLeft'] ?? null;

                $ticket = EventTicket::create([
                    'event_id' => $event->id,
                    'name' => $ticketData['name'],
                    'price' => $ticketData['price'] ?? 0,
                    'description' => $ticketData['description'] ?? null,
                    'benefits' => $ticketData['benefits'] ?? [],
                    'limited' => $ticketData['limited'] ?? false,
                    'slots_left' => ($ticketData['limited'] ?? false) ? ($slotsLeft ? (int)$slotsLeft : null) : null,
                    'sold' => 0,
                ]);
                $tickets[] = $ticket;
            }

            $event->load(['user:id,first_name,last_name,email,phone', 'tickets']);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $this->transformEvent($event),
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
            // Enforce: Only verified users can update their events
            $user = Auth::user();
            if (!$user || !$user->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can update events.'
                ], 403);
            }

            $event = Event::where('user_id', Auth::id())
                ->find($id);

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found or unauthorized',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'category' => 'sometimes|in:Academic,Social/Parties,Sports,Career,Religious,Cultural,Entertainment,Workshop,Other',
                'date' => 'sometimes|date',
                'time' => 'sometimes|string|max:255',
                'location' => 'sometimes|string|max:255',
                'status' => 'sometimes|in:upcoming,ongoing,completed,cancelled',
                'tags' => 'sometimes|array|max:5',
                'tags.*' => 'string|max:50',
                'sponsored' => 'sometimes|boolean',
                'images' => 'sometimes|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'existing_images' => 'sometimes|string|json', // Can be JSON string from FormData
                'tickets' => 'sometimes|array|min:1',
                'tickets.*.name' => 'required_with:tickets|string|max:255',
                'tickets.*.price' => 'required_with:tickets|numeric|min:0',
                'tickets.*.description' => 'nullable|string',
                'tickets.*.benefits' => 'array',
                'tickets.*.benefits.*' => 'string|max:255',
                'tickets.*.limited' => 'boolean',
                'tickets.*.slots_left' => 'nullable|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Extract event data - FormData is now parsed by middleware for PUT requests
            $eventData = $request->only([
                'title',
                'description',
                'category',
                'date',
                'time',
                'location',
                'status',
            ]);

            // Filter out empty values
            $eventData = array_filter($eventData, function ($value) {
                return $value !== null && $value !== '';
            });

            // Validate status if provided
            if (isset($eventData['status'])) {
                $statusValue = (string)$eventData['status'];
                if (!in_array($statusValue, ['upcoming', 'ongoing', 'completed', 'cancelled'])) {
                    unset($eventData['status']);
                }
            }

            // Handle sponsored - can be string "1"/"0" or boolean
            if ($request->has('sponsored')) {
                $sponsored = $request->input('sponsored');
                $eventData['sponsored'] = ($sponsored === '1' || $sponsored === 1 || $sponsored === true);
            }

            // Handle tags - can come as array or JSON string
            if ($request->has('tags')) {
                if (is_string($request->input('tags'))) {
                    $tags = json_decode($request->input('tags'), true);
                    $eventData['tags'] = is_array($tags) ? $tags : [];
                } else {
                    $eventData['tags'] = $request->input('tags', []);
                }
            }

            // Handle image uploads
            // If existing_images parameter is provided, use it; otherwise merge with new files
            if ($request->has('existing_images')) {
                // existing_images can be a JSON string from FormData or an array
                $existingImages = [];
                $existingImagesInput = $request->input('existing_images');

                if (is_string($existingImagesInput)) {
                    // Try to decode JSON string
                    $decoded = json_decode($existingImagesInput, true);
                    $existingImages = is_array($decoded) ? $decoded : [];
                } elseif (is_array($existingImagesInput)) {
                    $existingImages = $existingImagesInput;
                }

                // Validate that existing images are URLs
                $existingImages = array_filter($existingImages, function ($url) {
                    return filter_var($url, FILTER_VALIDATE_URL) !== false;
                });

                $newImagePaths = [];
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $image->store('events', 'public');
                        $newImagePaths[] = asset('storage/' . $path);
                    }
                }

                // Combine existing URLs and new file paths, filter out any empty values
                $eventData['images'] = array_values(array_filter(array_merge($existingImages, $newImagePaths)));
                // Limit to 5 images
                $eventData['images'] = array_slice($eventData['images'], 0, 5);
            } elseif ($request->hasFile('images')) {
                // If no existing_images specified, append new files to existing ones (backward compatibility)
                $existingImages = $event->images ?? [];
                if (!is_array($existingImages)) {
                    $existingImages = [];
                }
                $newImagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events', 'public');
                    $newImagePaths[] = asset('storage/' . $path);
                }
                $eventData['images'] = array_values(array_filter(array_merge($existingImages, $newImagePaths)));
                // Limit to 5 images
                $eventData['images'] = array_slice($eventData['images'], 0, 5);
            }

            // Only update if we have data to update
            if (!empty($eventData)) {
                Log::info('Updating event status', [
                    'event_id' => $id,
                    'status' => $eventData['status'] ?? 'other fields',
                    'eventData' => $eventData,
                ]);

                $event->update($eventData);
                // Refresh the event to ensure we have the latest data
                $event->refresh();

                // Verify the status was updated
                Log::info('Event updated successfully', [
                    'event_id' => $id,
                    'new_status' => $event->status,
                    'old_status' => $event->getOriginal('status'),
                ]);
            } else {
                Log::warning('No data to update', [
                    'event_id' => $id,
                    'request_all' => $request->all(),
                ]);
            }

            // Update tickets if provided
            if ($request->has('tickets')) {
                // Handle JSON string or array
                $ticketsData = $request->input('tickets');
                if (is_string($ticketsData)) {
                    $ticketsData = json_decode($ticketsData, true);
                }

                if (is_array($ticketsData)) {
                    // Delete existing tickets
                    $event->tickets()->delete();

                    // Create new tickets
                    foreach ($ticketsData as $ticketData) {
                        // Handle both snake_case and camelCase field names
                        $slotsLeft = $ticketData['slots_left'] ?? $ticketData['slotsLeft'] ?? null;
                        $sold = $ticketData['sold'] ?? 0;

                        EventTicket::create([
                            'event_id' => $event->id,
                            'name' => $ticketData['name'],
                            'price' => $ticketData['price'] ?? 0,
                            'description' => $ticketData['description'] ?? null,
                            'benefits' => $ticketData['benefits'] ?? [],
                            'limited' => $ticketData['limited'] ?? false,
                            'slots_left' => ($ticketData['limited'] ?? false) ? ($slotsLeft ? (int)$slotsLeft : null) : null,
                            'sold' => (int)$sold, // Preserve sold count
                        ]);
                    }

                    // Recalculate stats
                    $event->refresh();
                    $this->recalculateEventStats($event);
                }
            }

            $event->load(['user:id,first_name,last_name,email,phone', 'tickets']);

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $this->transformEvent($event),
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
            // Enforce: Only verified users can delete their events
            $user = Auth::user();
            if (!$user || !$user->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only verified users can delete events.'
                ], 403);
            }

            $event = Event::where('user_id', Auth::id())
                ->find($id);

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
            // Ensure we only return events for the authenticated user
            $userId = Auth::id();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $query = Event::with(['user:id,first_name,last_name,email,phone', 'tickets'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc');

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->has('search')) {
                $search = $request->input('search');
                $query->search($search);
            }

            $events = $query->paginate($request->input('per_page', 12));

            // Transform data to match frontend expectations
            $eventsData = $events->getCollection()->map(function ($event) {
                return $this->transformEvent($event);
            })->values()->all();

            return response()->json([
                'success' => true,
                'data' => $eventsData,
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
            $event = Event::find($id);

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

    /**
     * Transform event data to match frontend expectations
     */
    private function transformEvent($event)
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'category' => $event->category,
            'description' => $event->description,
            'date' => $event->date->format('Y-m-d'),
            'time' => $event->time,
            'location' => $event->location,
            'images' => $event->images ?? [],
            'tags' => $event->tags ?? [],
            'status' => $event->status,
            'sponsored' => $event->sponsored,
            'views' => $event->views,
            'interested' => $event->interested,
            'ticketsSold' => $event->tickets_sold,
            'revenue' => floatval($event->revenue),
            'tickets' => $event->tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'name' => $ticket->name,
                    'price' => floatval($ticket->price),
                    'description' => $ticket->description,
                    'benefits' => $ticket->benefits ?? [],
                    'limited' => $ticket->limited,
                    'slotsLeft' => $ticket->slots_left,
                    'sold' => $ticket->sold,
                ];
            }),
            'user' => $event->user,
            'created_at' => $event->created_at->toISOString(),
            'updated_at' => $event->updated_at->toISOString(),
        ];
    }

    /**
     * Purchase an event ticket
     */
    public function purchaseTicket(Request $request, $eventId, $ticketId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'quantity' => 'integer|min:1|max:10',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $event = Event::findOrFail($eventId);
            $ticket = EventTicket::where('event_id', $eventId)->findOrFail($ticketId);
            $quantity = $request->input('quantity', 1);
            $ticketPrice = floatval($ticket->price);
            $totalAmount = $ticketPrice * $quantity;

            // Check if ticket is available
            if ($ticket->limited && $ticket->slots_left !== null && $ticket->slots_left < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough tickets available',
                ], 400);
            }

            // For free tickets, no payment needed
            if ($ticketPrice == 0) {
                DB::beginTransaction();
                try {
                    // Create purchased ticket
                    $purchasedTicket = PurchasedTicket::create([
                        'user_id' => $user->id,
                        'event_id' => $eventId,
                        'ticket_id' => $ticketId,
                        'price_paid' => 0,
                        'quantity' => $quantity,
                        'total_amount' => 0,
                        'status' => 'confirmed',
                    ]);

                    // Update ticket sold count
                    $ticket->increment('sold', $quantity);
                    if ($ticket->limited && $ticket->slots_left !== null) {
                        $ticket->decrement('slots_left', $quantity);
                    }
                    $ticket->save();

                    // Recalculate event stats
                    $this->recalculateEventStats($event);

                    DB::commit();

                    return response()->json([
                        'success' => true,
                        'message' => 'Free ticket registered successfully',
                        'data' => [
                            'purchased_ticket' => $this->transformPurchasedTicket($purchasedTicket),
                        ],
                    ]);
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            }

            // For paid tickets, check wallet balance
            $user->refresh();
            $walletBalance = floatval($user->wallet_balance ?? 0);

            if ($walletBalance < $totalAmount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient wallet balance',
                    'data' => [
                        'required' => $totalAmount,
                        'available' => $walletBalance,
                        'insufficient' => $totalAmount - $walletBalance,
                    ],
                ], 400);
            }

            DB::beginTransaction();
            try {
                // Deduct from wallet
                $user->decrement('wallet_balance', $totalAmount);

                // Create transaction record
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'debit',
                    'amount' => $totalAmount,
                    'description' => "Event ticket purchase: {$event->title} - {$ticket->name}",
                    'status' => 'completed',
                    'reference' => 'TKT-' . time() . '-' . $user->id,
                    'payment_method' => 'wallet',
                ]);

                // Create purchased ticket
                $purchasedTicket = PurchasedTicket::create([
                    'user_id' => $user->id,
                    'event_id' => $eventId,
                    'ticket_id' => $ticketId,
                    'price_paid' => $ticketPrice,
                    'quantity' => $quantity,
                    'total_amount' => $totalAmount,
                    'status' => 'confirmed',
                    'transaction_id' => $transaction->id,
                ]);

                // Update ticket sold count
                $ticket->increment('sold', $quantity);
                if ($ticket->limited && $ticket->slots_left !== null) {
                    $ticket->decrement('slots_left', $quantity);
                }
                $ticket->save();

                // Recalculate event stats
                $this->recalculateEventStats($event);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Ticket purchased successfully',
                    'data' => [
                        'purchased_ticket' => $this->transformPurchasedTicket($purchasedTicket),
                        'transaction' => $transaction,
                        'new_balance' => $user->fresh()->wallet_balance,
                    ],
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to purchase ticket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's purchased tickets
     */
    public function getPurchasedTickets(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $query = PurchasedTicket::with(['event:id,title,date,time,location,images,category', 'ticket:id,name,description,benefits'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Filter by event
            if ($request->has('event_id')) {
                $query->where('event_id', $request->input('event_id'));
            }

            $tickets = $query->paginate($request->input('per_page', 20));

            $ticketsData = $tickets->getCollection()->map(function ($purchasedTicket) {
                return $this->transformPurchasedTicket($purchasedTicket);
            })->values()->all();

            return response()->json([
                'success' => true,
                'data' => $ticketsData,
                'pagination' => [
                    'current_page' => $tickets->currentPage(),
                    'last_page' => $tickets->lastPage(),
                    'per_page' => $tickets->perPage(),
                    'total' => $tickets->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load purchased tickets: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single purchased ticket
     */
    public function getPurchasedTicket($id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $purchasedTicket = PurchasedTicket::with(['event:id,title,date,time,location,images,category,description', 'ticket:id,name,description,benefits', 'transaction:id,amount,status,created_at'])
                ->where('user_id', $user->id)
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->transformPurchasedTicket($purchasedTicket),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }
    }

    /**
     * Get event attendees (purchased tickets for an event)
     */
    public function getEventAttendees(Request $request, $eventId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            // Check if user owns the event
            $event = Event::findOrFail($eventId);
            if ($event->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only view attendees for your own events.',
                ], 403);
            }

            $query = PurchasedTicket::with(['user:id,first_name,last_name,email,phone', 'ticket:id,name,price'])
                ->where('event_id', $eventId)
                ->where('status', 'confirmed')
                ->orderBy('created_at', 'desc');

            $attendees = $query->paginate($request->input('per_page', 50));

            $attendeesData = $attendees->getCollection()->map(function ($purchasedTicket) {
                return [
                    'id' => $purchasedTicket->id,
                    'ticket_code' => $purchasedTicket->ticket_code,
                    'user' => $purchasedTicket->user ? [
                        'id' => $purchasedTicket->user->id,
                        'name' => $purchasedTicket->user->first_name . ' ' . $purchasedTicket->user->last_name,
                        'email' => $purchasedTicket->user->email,
                        'phone' => $purchasedTicket->user->phone,
                    ] : null,
                    'ticket' => $purchasedTicket->ticket ? [
                        'id' => $purchasedTicket->ticket->id,
                        'name' => $purchasedTicket->ticket->name,
                        'price' => floatval($purchasedTicket->ticket->price),
                    ] : null,
                    'price_paid' => floatval($purchasedTicket->price_paid),
                    'quantity' => $purchasedTicket->quantity,
                    'total_amount' => floatval($purchasedTicket->total_amount),
                    'status' => $purchasedTicket->status,
                    'created_at' => $purchasedTicket->created_at->toISOString(),
                ];
            })->values()->all();

            return response()->json([
                'success' => true,
                'data' => $attendeesData,
                'pagination' => [
                    'current_page' => $attendees->currentPage(),
                    'last_page' => $attendees->lastPage(),
                    'per_page' => $attendees->perPage(),
                    'total' => $attendees->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load attendees: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Transform purchased ticket for API response
     */
    private function transformPurchasedTicket($purchasedTicket)
    {
        return [
            'id' => $purchasedTicket->id,
            'ticket_code' => $purchasedTicket->ticket_code,
            'event' => $purchasedTicket->event ? [
                'id' => $purchasedTicket->event->id,
                'title' => $purchasedTicket->event->title,
                'date' => $purchasedTicket->event->date ? $purchasedTicket->event->date->format('Y-m-d') : null,
                'time' => $purchasedTicket->event->time,
                'location' => $purchasedTicket->event->location,
                'category' => $purchasedTicket->event->category,
                'images' => $purchasedTicket->event->images ?? [],
            ] : null,
            'ticket' => $purchasedTicket->ticket ? [
                'id' => $purchasedTicket->ticket->id,
                'name' => $purchasedTicket->ticket->name,
                'description' => $purchasedTicket->ticket->description,
                'benefits' => $purchasedTicket->ticket->benefits ?? [],
            ] : null,
            'price_paid' => floatval($purchasedTicket->price_paid),
            'quantity' => $purchasedTicket->quantity,
            'total_amount' => floatval($purchasedTicket->total_amount),
            'status' => $purchasedTicket->status,
            'transaction_id' => $purchasedTicket->transaction_id,
            'created_at' => $purchasedTicket->created_at->toISOString(),
            'updated_at' => $purchasedTicket->updated_at->toISOString(),
        ];
    }

    /**
     * Recalculate event stats based on tickets
     */
    private function recalculateEventStats($event)
    {
        $event->load('tickets');
        $ticketsSold = $event->tickets->sum('sold');
        $revenue = $event->tickets->sum(function ($ticket) {
            return $ticket->price * $ticket->sold;
        });

        $event->update([
            'tickets_sold' => $ticketsSold,
            'revenue' => $revenue,
        ]);
    }
}
