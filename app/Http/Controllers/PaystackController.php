<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PaystackController extends Controller
{
    public function initialize(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'amount' => 'required|numeric|min:1',
        ]);

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post(config('services.paystack.payment_url') . '/transaction/initialize', [
                'email' => $request->query('email'),
                'amount' => $request->query('amount') * 100,
                'callback_url' => route('paystack.callback'),
            ]);

        if ($response->successful()) {
            return redirect($response['data']['authorization_url']);
        }

        return back()->with('error', 'Failed to initialize payment.');
    }



    public function callback(Request $request)
    {
        $reference = $request->query('reference');

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->get(config('services.paystack.payment_url') . "/transaction/verify/{$reference}");

        if ($response->successful() && $response['data']['status'] === 'success') {
            $data = $response['data'];
            $user = Auth::user();

            // Prevent duplicate
            if (!Transaction::where('reference', $data['reference'])->exists()) {
                Transaction::create([
                    'user_id' => $user->id,
                    'reference' => $data['reference'],
                    'amount' => $data['amount'],
                    'type' => 'credit',
                    'status' => $data['status'],
                    'gateway_response' => $data['gateway_response'],
                ]);

                $user->increment('balance', $data['amount']);
            }

            return redirect()->route('dashboard.index')->with('success', 'Payment successful!');
        }

        return redirect()->route('dashboard.index')->with('error', 'Payment failed or cancelled.');
    }
}
