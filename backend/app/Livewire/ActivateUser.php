<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('components.DashboardLayout')]

class ActivateUser extends Component
{

    public function boot()
    {
        if (Auth::user()->is_verified) {
            return redirect()->route('dashboard.index');
        }
    }
    public function render()
    {
        return view('livewire.activate-user')->title('Activate Account');
    }
}
