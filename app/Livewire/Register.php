<?php
// app/Livewire/Register.php

namespace App\Livewire;

use App\Livewire\Forms\RegisterForm;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('components.HomeLayout')]
class Register extends Component
{
    public RegisterForm $form;
    public ?int $referrer_id = null;

    public function mount($referrer_id = null)
    {
        $this->referrer_id = $referrer_id;
    }

    public function registerUser()
    {
        $this->form->validate();

        try {
            $user = User::create([
                'first_name'   => $this->form->first_name,
                'last_name'    => $this->form->last_name,
                'email'        => $this->form->email,
                'password'     => bcrypt($this->form->password),
                'is_verified'  => false, // must be approved
                'role'         => 'user',
                'status'       => 'active',
                'picture'      => 'default.png',
                'phone'        => $this->form->phone,
                'balance'      => 0,
                'referrer_id'  => $this->referrer_id,
            ]);

            // Send Email: contact WhatsApp admin
            $this->form->sendEmail($user);

            // Log in user
            Auth::login($user);
            request()->session()->regenerate();

            session()->flash('success', 'Account registered successfully. Please contact WhatsApp Admin for activation.');

            return redirect()->route('dashboard.index');
        } catch (\Exception $e) {
            session()->flash('error', 'Account Registration failed');
            Log::error('Registration Error: ' . $e->getMessage());
        }
    }

    public function render()
    {
        return view('livewire.register');
    }
}
