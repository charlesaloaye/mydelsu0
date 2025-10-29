<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('CGPA Calculator')]
class GuestCgpa extends Component
{
    public function render()
    {
        return view('livewire.guest-cgpa');
    }
}
