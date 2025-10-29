<?php

namespace App\Livewire\Admin;

use App\Models\User as ModelsUser;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.AdminLayout')]
#[Title('User Profile')]
class User extends Component
{
    public $id;
    public function render()
    {

        return view('livewire.admin.user', [
            'user' => ModelsUser::findOrFail($this->id)
        ]);
    }
}
