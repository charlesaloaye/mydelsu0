<?php

namespace App\Livewire;

use App\Livewire\Forms\PaystackForm;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Title;
use Livewire\Component;
use Illuminate\Support\Facades\Http;

#[Title('Fund Account')]
class PaystackPayment extends Component
{

    public PaystackForm $form;

    public function makePayment()
    {
        $this->form->validate();

        // Call the API directly here (instead of redirect)
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post(config('services.paystack.payment_url') . '/transaction/initialize', [
                'email' => Auth::user()->email,
                'amount' => $this->form->amount * 100,
                'callback_url' => route('paystack.callback'),
            ]);

        if ($response->successful()) {
            return redirect($response['data']['authorization_url']);
        }

        session()->flash('error', 'Failed to initialize payment.');
    }


    //     public function render()
    //     {
    //         return view('livewire.paystack-payment');
    //     }
    // }

}
