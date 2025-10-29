<?php

namespace App\Livewire\Admin;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;

#[Layout('components.AdminLayout')]
#[Title('Users')]
class Users extends Component
{
    use WithPagination;

    public $search = '';
    public $editingUserId = null;

    public function startEdit($userId, $balance)
    {
        $this->editingUserId = $userId;
        $this->form->amount = $balance;
    }

    public function cancelEdit()
    {
        $this->editingUserId = null;
        $this->resetErrorBag();
    }



    public function updateUserStatus($userId, $status)
    {
        $user = User::findOrFail($userId);
        $user->is_verified = $status;
        $user->save();

        session()->flash('success', 'User status updated.');
    }

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $users = User::query()
            ->when(
                strlen(trim($this->search)) > 0,
                fn($q) => $q->where(function ($query) {
                    $query->where('first_name', 'like', "%{$this->search}%")
                        ->orWhere('last_name', 'like', "%{$this->search}%")
                        ->orWhere('email', 'like', "%{$this->search}%");
                })
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return view('livewire.admin.users', compact('users'));
    }
}
