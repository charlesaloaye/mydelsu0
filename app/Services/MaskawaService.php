<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Auth;

class MaskawaService
{
    protected string $token;
    protected string $baseUrl;

    public function __construct()
    {
        $this->token = trim(config('services.maskawa.token'));
        $this->baseUrl = rtrim(config('services.maskawa.base_url', 'https://www.maskawasub.com/api'), '/');
    }

    /**
     * Purchase data bundle
     */
    public function buyData(int $networkId, string $number, int $planId): array
    {
        return $this->makeRequest('/data/', [
            'network' => $networkId,
            'mobile_number' => $number,
            'plan' => $planId,
            'Ported_number' => true,
        ], 'data purchase');
    }

    /**
     * Purchase airtime
     */
    public function buyAirtime(int $networkId, string $phone, float $amount, string $type = 'VTU'): array
    {
        return $this->makeRequest('/topup/', [
            'network' => $networkId,
            'amount' => $amount,
            'mobile_number' => $phone,
            'Ported_number' => true,
            'airtime_type' => $type,
        ], 'airtime purchase');
    }

    /**
     * Make authenticated API request
     */
    protected function makeRequest(string $endpoint, array $payload, string $action): array
    {
        try {
            if (empty($this->token)) {
                throw new \Exception('API token not configured');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Token ' . $this->token, // ← Corrected here
                'Accept' => 'application/json',
            ])
                ->timeout(15)
                ->post($this->baseUrl . $endpoint, $payload);

            $json = $response->json() ?? [];
            $status = $response->status();


            if ($status === 401) {
                throw new \Exception('Invalid API token - please verify your credentials');
            }

            return [
                'status' => $response->successful(),
                'message' => $json['message'] ?? $this->getDefaultMessage($status, $action),
                'data' => $json,
                'results' => $json['results'] ?? [], // Ensure consistent structure
                'http_status' => $status,
            ];
        } catch (RequestException $e) {
            $errorData = [
                'status' => false,
                'message' => 'API request failed',
                'error' => $e->getMessage(),
                'http_status' => $e->response->status() ?? 500,
            ];

            if ($e->response->status() === 401) {
                $errorData['message'] = 'Authentication failed - please check your API token';
                Log::error('Maskawa API Authentication Failure', [
                    'response' => $e->response->body(),
                    'token' => '****' . substr($this->token, -4)
                ]);
            }

            return $errorData;
        } catch (\Exception $e) {
            // Log::error("Maskawa {$action} error", ['error' => $e->getMessage()]);
            return [
                'status' => false,
                'message' => 'Service unavailable',
                'error' => $e->getMessage(),
            ];
        }
    }


    protected function getDefaultMessage(int $status, string $action): string
    {
        return match ($status) {
            200, 201 => ucfirst($action) . ' successful',
            401 => 'Authentication failed',
            403 => 'Forbidden - check permissions',
            404 => 'Endpoint not found',
            422 => 'Validation error',
            500 => 'Server error',
            default => 'Request completed with unexpected status'
        };
    }
}
