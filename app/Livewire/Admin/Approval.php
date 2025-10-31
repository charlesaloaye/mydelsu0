<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\User;
use App\Models\ReferralReward;
// use App\Notifications\Admin\ReferralRewardNotification;
// use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;

#[Layout('components.AdminLayout')]
#[Title('Contest Approvals - Admin')]

class Approval extends Component
{
    use WithPagination;

    public $search = '';
    protected $paginationTheme = 'bootstrap';

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updateUserStatus($userId, $status)
    {
        DB::transaction(function () use ($userId, $status) {
            $user = User::with('referrer')->findOrFail($userId);
            $user->update(['is_verified' => $status]);

            // Reward referrer if activating
            if ($status && $user->referrer) {
                ReferralReward::create([
                    'user_id' => $user->referrer->id,
                    'referred_user_id' => $user->id,
                    'amount' => 100,
                    'is_paid' => true,
                ]);
                $user->referrer->increment('balance', 100);
            }
        });

        session()->flash('success', 'User status updated successfully!');
        // $this->emit('userApproved'); // Confetti
    }

    public function render()
    {
        $users = User::with('referrer')
            ->when($this->search, function ($query) {
                $query->where(function ($q) {
                    $q->where('first_name', 'like', "%{$this->search}%")
                        ->orWhere('last_name', 'like', "%{$this->search}%")
                        ->orWhere('email', 'like', "%{$this->search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('livewire.admin.approval', compact('users'));
    }
}
