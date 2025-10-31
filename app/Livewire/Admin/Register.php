<?php

namespace App\Livewire\Admin;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('components.AdminHomeLayout')]

class Register extends Component
{
    public function render()
    {
        return view('livewire.admin.register');
    }
}
