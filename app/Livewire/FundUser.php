<?php

namespace App\Livewire;

use App\Livewire\Forms\admin\TransactionForm;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.AdminLayout')]
#[Title('Fund User')]
class FundUser extends Component
{
    public TransactionForm $form;

    public $id;

    public function saveBalance($id)
    {
        $this->form->validate();

        try {
            // Perform New Transaction

            // Credit User

            if ($this->form->action === 'credit') {
                $this->form->topUpTransaction($id);
            }

            if ($this->form->action === 'debit') {

                // Debit User
                $this->form->deductTransaction($id);
            }

            Log::info($this->form->action);

            session()->flash('success', 'Balance updated successfully.');

            return redirect()->route('admin.users');
        } catch (\Throwable $th) {
            session()->flash('error', 'Unable to carry out transaction');
        }
    }

    public function render()
    {
        return view('livewire.fund-user', [
            'user' => User::findOrFail($this->id),
        ]);
    }
}
