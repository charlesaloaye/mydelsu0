<?php
// app/Services/BudpayAirtimeService.php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BudpayAirtimeService
{
    public function topUp($network, $phone, $amount)
    {
        $secretKey = config('app.budpay_secret_key'); // ✅ Use SECRET key here
        $reference = Str::random(12); // or any unique ID

        $data = [
            'provider' => strtoupper($network), // MTN, GLO, etc.
            'number'   => $phone,
            'amount'   => $amount,
            'reference' => $reference,
        ];

        $signature = hash_hmac('sha512', json_encode($data), $secretKey);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $secretKey,          // ✅ SECRET key here
            'Encryption'    => $signature,                      // ✅ Header should be "Encryption"
            'Content-Type'  => 'application/json',
        ])->post('https://api.budpay.com/api/v2/airtime/topup', $data);

        return $response->json();
    }
}
