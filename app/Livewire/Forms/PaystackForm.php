<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PaystackForm extends Form
{
    #[Validate('required|numeric|min:1')]
    public $amount;
}
