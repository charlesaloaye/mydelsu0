<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Logout extends Component
{
    public function mount()
    {
        Auth::logout();

        return redirect()->route('login');
    }
    public function render()
    {
        return redirect()->route('login');
    }
}
