<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.DashboardLayout')]
#[Title('Coming Soon')]
class ComingSoon extends Component
{
    public function render()
    {
        return view('livewire.coming-soon');
    }
}
