<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class BuyServiceForm extends Form
{
    #[Validate('required|int')]
    public $networkId;

    #[Validate('required|int')]
    public $planId;

    #[Validate('required')]
    public $mobileNumber;

    #[Validate('required|array')]
    public $networks = [];

    #[Validate('required|array')]
    public $plans = [];

    public ?string $message = null;
    public ?string $status = null;
}
