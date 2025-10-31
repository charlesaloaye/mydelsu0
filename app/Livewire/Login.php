<?php

namespace App\Livewire;

use App\Livewire\Forms\LoginForm;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;


#[Layout('components.HomeLayout')]
class Login extends Component
{

    public LoginForm $form;

    public function loginUser()
    {


        $this->form->validate();

        if (Auth::attempt(['email' => $this->form->email, 'password' => $this->form->password])) {


            if (Auth::user()->is_verified) {

                request()->session()->regenerateToken();

                session()->flash('success', 'Account logged in successfully');

                return redirect()->route('dashboard.activate');
            }


            if (!Auth::user()->is_verified) {

                session()->flash('success', 'Account Please verify your account');
                return redirect()->route('dashboard.activate');
            }
        }
    }


    public function render()
    {

        return view('livewire.login');
    }
}
