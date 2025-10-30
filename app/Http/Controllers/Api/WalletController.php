<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Transaction;
use App\Models\ReferralReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class WalletController extends Controller
{
    /**
     * Get wallet information
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $availableBalance = $user->wallet_balance ?? 0;
        $pendingBalance = Transaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');

        $totalEarned = Transaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->where('status', 'completed')
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'available_balance' => $availableBalance,
                'pending_balance' => $pendingBalance,
                'total_earned' => $totalEarned,
                'can_withdraw' => $availableBalance >= 2500, // Minimum withdrawal amount
                'currency' => '₦'
            ]
        ]);
    }

    /**
     * Get wallet transactions
     */
    public function transactions(Request $request)
    {
        $user = $request->user();

        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Fund wallet
     */
    public function fund(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:100',
            'payment_method' => 'required|in:bank_transfer,card,paystack',
            'bank_details' => 'required_if:payment_method,bank_transfer|array',
            'bank_details.account_number' => 'required_if:payment_method,bank_transfer|string',
            'bank_details.bank_name' => 'required_if:payment_method,bank_transfer|string',
            'bank_details.account_name' => 'required_if:payment_method,bank_transfer|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Create pending transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'type' => 'credit',
            'amount' => $request->amount,
            'description' => 'Account funding via ' . $request->payment_method,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'reference' => 'FUND_' . time() . '_' . $user->id,
            'metadata' => json_encode($request->bank_details ?? [])
        ]);

        // Handle different payment methods
        if ($request->payment_method === 'paystack') {
            // Initialize Paystack payment
            return $this->processPaystackPayment($transaction);
        }

        return response()->json([
            'success' => true,
            'message' => 'Funding request created. Please complete payment.',
            'data' => [
                'transaction' => $transaction,
                'payment_instructions' => $this->getPaymentInstructions($request->payment_method, $transaction)
            ]
        ]);
    }

    /**
     * Withdraw funds
     */
    public function withdraw(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:2500',
            'bank_details' => 'required|array',
            'bank_details.account_number' => 'required|string',
            'bank_details.bank_name' => 'required|string',
            'bank_details.account_name' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if ($user->wallet_balance < $request->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient balance'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Deduct from wallet
            $user->decrement('wallet_balance', $request->amount);

            // Create withdrawal transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $request->amount,
                'description' => 'Withdrawal to bank account',
                'status' => 'pending',
                'payment_method' => 'bank_transfer',
                'reference' => 'WITHDRAW_' . time() . '_' . $user->id,
                'metadata' => json_encode($request->bank_details)
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal request submitted successfully. It will be processed within 24 hours.',
                'data' => [
                    'transaction' => $transaction,
                    'new_balance' => $user->fresh()->wallet_balance
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Withdrawal failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Buy airtime
     */
    public function buyAirtime(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
            'network' => 'required|in:mtn,airtel,globacom,etisalat',
            'amount' => 'required|numeric|min:50|max:10000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $amount = $request->amount;

        if ($user->wallet_balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient balance'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Deduct from wallet
            $user->decrement('wallet_balance', $amount);

            // Create airtime transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $amount,
                'description' => ucfirst($request->network) . ' Airtime - ₦' . $amount,
                'status' => 'pending',
                'payment_method' => 'wallet',
                'reference' => 'AIRTIME_' . time() . '_' . $user->id,
                'metadata' => json_encode([
                    'phone_number' => $request->phone_number,
                    'network' => $request->network,
                    'amount' => $amount
                ])
            ]);

            // Process airtime purchase (integrate with airtime provider)
            $airtimeResult = $this->processAirtimePurchase($request->phone_number, $request->network, $amount);

            if ($airtimeResult['success']) {
                $transaction->update(['status' => 'completed']);
            } else {
                // Refund if failed
                $user->increment('wallet_balance', $amount);
                $transaction->update(['status' => 'failed', 'narration' => $airtimeResult['message']]);
            }

            DB::commit();

            return response()->json([
                'success' => $airtimeResult['success'],
                'message' => $airtimeResult['message'],
                'data' => [
                    'transaction' => $transaction,
                    'new_balance' => $user->fresh()->wallet_balance
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Airtime purchase failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Buy data
     */
    public function buyData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
            'network' => 'required|in:mtn,airtel,globacom,etisalat',
            'data_plan' => 'required|string',
            'amount' => 'required|numeric|min:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $amount = $request->amount;

        if ($user->wallet_balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient balance'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Deduct from wallet
            $user->decrement('wallet_balance', $amount);

            // Create data transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $amount,
                'description' => ucfirst($request->network) . ' Data - ' . $request->data_plan,
                'status' => 'pending',
                'payment_method' => 'wallet',
                'reference' => 'DATA_' . time() . '_' . $user->id,
                'metadata' => json_encode([
                    'phone_number' => $request->phone_number,
                    'network' => $request->network,
                    'data_plan' => $request->data_plan,
                    'amount' => $amount
                ])
            ]);

            // Process data purchase (integrate with data provider)
            $dataResult = $this->processDataPurchase($request->phone_number, $request->network, $request->data_plan, $amount);

            if ($dataResult['success']) {
                $transaction->update(['status' => 'completed']);
            } else {
                // Refund if failed
                $user->increment('wallet_balance', $amount);
                $transaction->update(['status' => 'failed', 'narration' => $dataResult['message']]);
            }

            DB::commit();

            return response()->json([
                'success' => $dataResult['success'],
                'message' => $dataResult['message'],
                'data' => [
                    'transaction' => $transaction,
                    'new_balance' => $user->fresh()->wallet_balance
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Data purchase failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Claim daily reward
     */
    public function claimDailyReward(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();

        // Check if user already claimed today
        $alreadyClaimed = Transaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->where('description', 'Daily reward')
            ->whereDate('created_at', $today)
            ->exists();

        if ($alreadyClaimed) {
            return response()->json([
                'success' => false,
                'message' => 'You have already claimed your daily reward today'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Add reward to wallet
            $user->increment('wallet_balance', 10);

            // Create reward transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'amount' => 10,
                'description' => 'Daily reward',
                'status' => 'completed',
                'payment_method' => 'system',
                'reference' => 'DAILY_REWARD_' . time() . '_' . $user->id
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Daily reward claimed successfully! ₦10 added to your wallet.',
                'data' => [
                    'reward_amount' => 10,
                    'new_balance' => $user->fresh()->wallet_balance,
                    'next_claim' => $today->addDay()->toDateString()
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'Failed to claim daily reward. Please try again.'
            ], 500);
        }
    }

    /**
     * Initialize Paystack payment
     */
    private function processPaystackPayment($transaction)
    {
        // This would integrate with Paystack API
        // For now, return a mock response
        return response()->json([
            'success' => true,
            'message' => 'Paystack payment initialized',
            'data' => [
                'transaction' => $transaction,
                'payment_url' => 'https://checkout.paystack.com/mock-payment-url',
                'reference' => $transaction->reference
            ]
        ]);
    }

    /**
     * Get payment instructions
     */
    private function getPaymentInstructions($method, $transaction)
    {
        switch ($method) {
            case 'bank_transfer':
                return [
                    'bank_name' => 'Access Bank',
                    'account_number' => '1234567890',
                    'account_name' => 'myDelsu Wallet',
                    'reference' => $transaction->reference,
                    'amount' => $transaction->amount
                ];
            default:
                return [];
        }
    }

    /**
     * Process airtime purchase
     */
    private function processAirtimePurchase($phone, $network, $amount)
    {
        // This would integrate with airtime provider API
        // For now, return a mock success response
        return [
            'success' => true,
            'message' => 'Airtime purchased successfully'
        ];
    }

    /**
     * Process data purchase
     */
    private function processDataPurchase($phone, $network, $plan, $amount)
    {
        // This would integrate with data provider API
        // For now, return a mock success response
        return [
            'success' => true,
            'message' => 'Data purchased successfully'
        ];
    }

    /**
     * Get data plans
     */
    public function getDataPlans(Request $request)
    {
        $network = $request->query('network', 'mtn');

        // Map network names to IDs
        $networkMap = [
            'mtn' => 1,
            'glo' => 2,
            '9mobile' => 3,
            'airtel' => 4
        ];

        $networkId = $networkMap[strtolower($network)] ?? 1;
        $dataPlans = config('dataplans.plans');

        if (!isset($dataPlans[$networkId])) {
            return response()->json([
                'success' => false,
                'message' => 'Network not found'
            ], 404);
        }

        $plans = $dataPlans[$networkId];

        // Format plans for frontend
        $formattedPlans = array_map(function ($plan) {
            return [
                'id' => $plan['id'],
                'name' => $plan['size'] . ' - ' . $plan['validity'],
                'price' => (int) $plan['price'],
                'size' => $plan['size'],
                'validity' => $plan['validity'],
                'plan_type' => $plan['plan_type'] ?? 'GENERAL'
            ];
        }, $plans);

        return response()->json([
            'success' => true,
            'data' => [
                'network' => strtoupper($network),
                'plans' => $formattedPlans
            ]
        ]);
    }

    /**
     * Initialize Paystack payment
     */
    public function initializePaystackPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:100',
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $secretKey = config('services.paystack.secret_key');
            $paymentUrl = config('services.paystack.payment_url');

            if (empty($secretKey) || $secretKey === 'sk_test_your_secret_key_here') {
                return response()->json([
                    'success' => false,
                    'message' => 'Paystack configuration missing. Please set PAYSTACK_SECRET_KEY in your environment variables.'
                ], 400);
            }

            $frontendUrl = env('FRONTEND_URL');
            $callbackUrl = $frontendUrl ? rtrim($frontendUrl, '/') . '/paystack/callback' : url('/paystack/callback');

            $response = Http::withToken($secretKey)
                ->post($paymentUrl . '/transaction/initialize', [
                    'email' => $request->email,
                    'amount' => $request->amount * 100, // Convert to kobo
                    'callback_url' => $callbackUrl,
                    'metadata' => [
                        'user_id' => $request->user()?->id,
                        'purpose' => 'wallet_funding',
                        'email' => $request->email,
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'message' => 'Payment initialized successfully',
                    'data' => [
                        'authorization_url' => $data['data']['authorization_url'],
                        'access_code' => $data['data']['access_code'],
                        'reference' => $data['data']['reference']
                    ]
                ]);
            }

            $errorData = $response->json();
            return response()->json([
                'success' => false,
                'message' => $errorData['message'] ?? 'Failed to initialize payment'
            ], 400);
        } catch (\Exception $e) {
            \Log::error('Paystack initialization error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment initialization failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify Paystack transaction and credit wallet
     */
    public function verifyPaystackTransaction(Request $request)
    {
        $reference = $request->query('reference') ?? $request->input('reference');

        if (!$reference) {
            return response()->json([
                'success' => false,
                'message' => 'Missing reference'
            ], 422);
        }

        try {
            $secretKey = config('services.paystack.secret_key');
            $paymentUrl = rtrim((string) config('services.paystack.payment_url'), '/');

            if (empty($secretKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paystack configuration missing.'
                ], 400);
            }

            $response = Http::withToken($secretKey)
                ->get($paymentUrl . "/transaction/verify/{$reference}");

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => $response->json('message') ?? 'Verification failed'
                ], 400);
            }

            $data = $response->json('data');

            if (!isset($data['status']) || $data['status'] !== 'success') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not successful'
                ], 400);
            }

            // Prevent duplicate processing
            if (\App\Models\Transaction::where('reference', $reference)->exists()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment already processed'
                ]);
            }

            $metadata = $data['metadata'] ?? [];
            $userId = $metadata['user_id'] ?? null;
            $email = $metadata['email'] ?? ($data['customer']['email'] ?? null);

            $user = null;
            if ($userId) {
                $user = User::find($userId);
            }
            if (!$user && $email) {
                $user = User::where('email', $email)->first();
            }

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found for this transaction'
                ], 404);
            }

            $amountNaira = (float) (($data['amount'] ?? 0) / 100);

            DB::beginTransaction();

            // Credit wallet
            $user->increment('wallet_balance', $amountNaira);

            // Record transaction
            $transaction = \App\Models\Transaction::create([
                'user_id' => $user->id,
                'amount' => $amountNaira,
                'type' => 'credit',
                'status' => 'completed',
                'description' => 'Wallet funding via Paystack',
            ]);
            // Ensure reference is saved even if not mass-assignable
            $transaction->reference = $reference;
            $transaction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment verified and wallet credited',
                'data' => [
                    'new_balance' => $user->fresh()->wallet_balance,
                    'transaction_id' => $transaction->id,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Paystack verify error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Verification error: ' . $e->getMessage()
            ], 500);
        }
    }
}
