<?php

namespace App\Livewire\Admin;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Logout extends Component
{

    public function boot()
    {
        // This method can be used to perform any setup before the component is rendered
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
        return redirect()->route('admin.auth.login');
    }
    public function render()
    {
        return redirect()->route('admin.auth.login');
    }
}
