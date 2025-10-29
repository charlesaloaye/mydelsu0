<?php


namespace App\Livewire\Forms\admin;

use App\Mail\TransactionMail;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Livewire\Attributes\Validate;
use Livewire\Form;

class TransactionForm extends Form
{
    #[Validate('required|numeric|min:100|max:1000000', as: 'Amount')]
    public $amount;

    #[Validate('required', as: 'Payment Type')]
    public $action;

    #[Validate('required|min:5', as: 'Reason for payment')]
    public $reason;

    public function topUpTransaction($id)
    {
        $user = $this->user($id);

        $user->increment('balance', $this->amount);

        $type = "credit";

        $status = "completed";

        $desc = "Deposit for {$user->first_name} {$user->last_name}";

        $transaction = $this->newTransaction($id, $user, $type, $status, $desc);

        $this->transactionMail($user, $transaction, $desc, $type);
    }


    public function deductTransaction($id)
    {
        $user = $this->user($id);

        $user->decrement('balance', $this->amount);

        $type = "debit";

        $status = "completed";

        $desc = "Withdrawal for {$user->first_name} {$user->last_name}";

        $transaction = $this->newTransaction($id, $user, $type, $status, $desc);

        $this->transactionMail($user, $transaction, $desc, $type);
    }

    // Transaction Email
    public function transactionMail($user, $transaction, $desc, $type)
    {
        $data = (object) [
            'balance' => $user->balance,
            'amount' => $transaction->amount,
            'type' => $type,
            'status' => $transaction->status,
            'description' => $transaction->desc,
            'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
            'name' => "{$user->first_name} {$user->last_name}",
        ];

        Mail::to($user)->send(new TransactionMail($data));
    }

    public function user($id)
    {
        return User::findOrFail($id);
    }


    public function newTransaction($id, $user, $type, $status, $desc)
    {
        return Transaction::create([
            'user_id' => $id,
            'amount' => $this->amount,
            'type' => $type,
            'status' => $status,
            'description' => $desc,
            'naration' => "Performed by " . Auth::user()->first_name . " " . Auth::user()->last_name,
        ]);
    }
}
