<?php

namespace App\Livewire\Forms;

use App\Mail\RegisterEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Email;
use Livewire\Attributes\Validate;
use Livewire\Form;

class RegisterForm extends Form
{
    #[Validate('required|string|min:3|max:100', as: 'First Name')]
    public $first_name;

    #[Validate('required|string|min:3|max:100', as: 'Last Name')]
    public $last_name;

    #[Validate('required|email|max:150|unique:users,email', as: 'Email Address')]
    public $email;

    #[Validate('required|string|max:11', as: 'Phone Number')]
    public $phone;

    #[Validate('required|string|min:8|confirmed', as: 'Password')]
    public $password;

    public $password_confirmation;


    #[Validate('required', as: 'Terms and Conditions')]
    public $terms;

    #[Validate('required', as: 'User Type')]
    public $type;

    // Send Email
    public function sendEmail($user)
    {

        Mail::to($this->email)->send(new RegisterEmail($user));
    }
}
