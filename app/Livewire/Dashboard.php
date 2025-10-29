<?php

namespace App\Livewire;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithPagination;

class Dashboard extends Component
{
    use WithPagination;

    public function mount()
    {
        if (!Auth::user()->is_verified) {
            return redirect()->route('dashboard.activate');
        }
    }

    public function render()
    {
        $payments = Transaction::where('user_id', Auth::id())->latest()->paginate(10);

        return view('livewire.dashboard', [
            'user' => Auth::user(),
            'payments' => $payments,
        ])->title('Dashboard');
    }
}
