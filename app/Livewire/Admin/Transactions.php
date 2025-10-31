<?php

namespace App\Livewire\Admin;

use App\Models\Transaction;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;

#[Layout('components.AdminLayout')]
class Transactions extends Component
{
    use WithPagination;

    public function render()
    {
        $payments = Transaction::with('user')->latest()->paginate(10);


        return view('livewire.transactions', [
            'payments' => $payments,
        ])->title('Payment History');
    }
}
