<?php

namespace App\Livewire;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithPagination;

class PaymentHistory extends Component
{
    use WithPagination;

    public function render()
    {
        $payments = Transaction::where('user_id', Auth::id())->get();

        return view('livewire.payment-history', [
            'payments' => $payments,
        ])->title('Payment History');
    }
}
