<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\Attributes\Layout;

#[Layout('components.AdminHomeLayout')]
class Reset extends Component
{
    public function render()
    {
        return view('livewire.admin.reset');
    }
}
