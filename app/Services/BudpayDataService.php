<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BudpayDataService
{
    protected $secret;
    protected $baseUrl;

    public function __construct()
    {
        $this->secret = config('app.budpay_secret_key');
        $this->baseUrl = config('app.budpay_base_url');
    }

    public function buyData($provider, $number, $planId)
    {
        $reference = 'BUDPAY_' . uniqid();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secret,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/internet/data", [
            'provider' => $provider,
            'number' => $number,
            'plan_id' => $planId,
            'reference' => $reference,
        ]);

        if ($response->successful()) {
            return [
                'status' => true,
                'message' => 'Data purchase successful',
                'data' => $response->json(),
            ];
        }

        return [
            'status' => false,
            'message' => $response->json('message') ?? 'Unknown error',
            'error' => $response->json(),
        ];
    }

    public function getProviders()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secret,
        ])->get("{$this->baseUrl}/internet");

        return $response->json();
    }

    public function getPlans($provider)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secret,
        ])->get("{$this->baseUrl}/internet/plans/{$provider}");

        return $response->json();
    }
}
