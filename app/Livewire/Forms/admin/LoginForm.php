<?php

namespace App\Livewire\Forms\admin;

use Livewire\Attributes\Validate;
use Livewire\Form;

class LoginForm extends Form
{
    #[Validate('required|email')]
    public $email = '';

    #[Validate('required|min:8|max:255')]
    public $password = '';

    #[Validate('boolean')]
    public $remember = false;
}
