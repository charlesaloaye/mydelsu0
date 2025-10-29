<?php

namespace App\Livewire\Admin;

use App\Livewire\Forms\admin\LoginForm;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.AdminHomeLayout')]
#[Title('Login')]
class Login extends Component
{

    public LoginForm $form;

    public function login()
    {

        $this->form->validate();

        $credentials = [
            'email' => $this->form->email,
            'password' => $this->form->password,
        ];
        // Check if 'remember me' is checked
        // If not, it will default to false
        $remember = $this->form->remember;

        if (Auth::attempt($credentials, $remember)) {
            // Regenerate the session to prevent session fixation attacks
            session()->regenerate();
            //Success message
            session()->flash('success', 'You are now logged in!');

            // Authentication passed...
            return redirect()->route('admin.dashboard'); // Redirect to intended page or home

        } else {
            $this->form->addError('email', 'The provided credentials do not match our records.');
        }
    }

    public function render()
    {
        return view('livewire.admin.login');
    }
}
