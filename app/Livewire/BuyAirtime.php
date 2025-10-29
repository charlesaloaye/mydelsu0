<?php

namespace App\Livewire;

use App\Livewire\Forms\AirtimeForm;
use App\Services\MaskawaService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Buy Airtime')]
class BuyAirtime extends Component
{
    public AirtimeForm $form;

    public function sendAirtime(MaskawaService $service)
    {
        $this->form->validate();

        try {
            $user = Auth::user();

            if ($user->balance < $this->form->amount) {

                $this->form->status = 'error';
                $this->form->message = 'Insufficient balance.';

                session()->flash($this->form->status, $this->form->message);

                return;
            }

            // Make API call
            $response = $service->buyAirtime(
                $this->form->network,
                $this->form->phone,
                $this->form->amount,
                $this->form->type ?? 'VTU'
            );


            // Handle the API response
            if ($this->isSuccessfulResponse($response)) {
                // Deduct balance
                $user->decrement('balance', $this->form->amount);

                $transactionData = [
                    'type' => 'debit',
                    'amount' => $this->form->amount,
                    'status' => 'completed',
                    'description' => 'Airtime Purchase',
                    'gateway_response' => json_encode([
                        'message' => 'Airtime purchase successful',
                        'details' => $response['data'] ?? $response
                    ]),
                ];

                $user->transactions()->create($transactionData);

                $this->form->status = 'success';
                $this->form->message = 'Airtime purchase successful for ' .
                    ($response['data']['mobile_number'] ?? $this->form->phone);

                session()->flash($this->form->status, $this->form->message);

                return redirect()->route('dashboard.index');
                #Space

            } else {
                $errorMessage = $response['data']['Status'] ??
                    $response['data']['message'] ??
                    $response['message'] ??
                    'Transaction failed';

                $this->handleFailedTransaction($user, $response, $errorMessage);
            }
        } catch (\Exception $e) {
            $this->handleFailedTransaction(
                $user ?? null,
                $response ?? null,
                'Service error: ' . $e->getMessage()
            );
        }
    }

    protected function isSuccessfulResponse($response)
    {
        $status = strtolower(trim($response['data']['Status'] ?? ''));

        if ($status === 'successful') {
            return true;
        }

        if (($response['status'] ?? false) === true) {
            return true;
        }

        if (in_array($response['http_status'] ?? null, [200, 201])) {
            return true;
        }

        return false;
    }


    protected function handleFailedTransaction($user, $response, $errorMessage)
    {
        $this->form->status = 'error';
        $this->form->message = $errorMessage;

        session()->flash($this->form->status, $this->form->message);

        if ($user) {
            $user->transactions()->create([
                'type' => 'debit',
                'amount' => $this->form->amount,
                'status' => 'failed',
                'description' => 'Airtime Purchase',
                'gateway_response' => json_encode($response ?? ['error' => 'No response received']),
            ]);
        }
    }
}
