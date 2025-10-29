<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class AirtimeForm extends Form
{
    #[Validate([
        'required',
        'string',
        'min:11',
        'max:15',
        'regex:/^(\+)?[0-9]+$/'
    ], message: [
        'required' => 'Phone number is required',
        'min' => 'Phone number must be at least 11 digits',
        'regex' => 'Invalid phone number format'
    ])]
    public string $phone = '';

    #[Validate([
        'required',
        'in:1,2,3,4'
    ], message: [
        'required' => 'Network provider is required',
        'in' => 'Invalid network selection'
    ])]
    public int $network = 1; // Default to first network option

    #[Validate([
        'required',
        'numeric',
        'min:50',
        'max:10000'
    ], message: [
        'required' => 'Amount is required',
        'min' => 'Minimum airtime purchase is ₦50',
        'max' => 'Maximum airtime purchase is ₦10,000'
    ])]
    public float $amount = 100.0; // Default amount

    #[Validate('sometimes|in:VTU,SMS')]
    public string $type = 'VTU'; // Default airtime type

    public ?string $message = null;
    public ?string $status = null;

    // Network options for the form select
    public function networkOptions(): array
    {
        return [
            1 => 'MTN',
            2 => 'GLO',
            3 => 'Airtel',
            4 => '9Mobile'
        ];
    }

    // Prepare the phone number for API request
    public function getFormattedPhone(): string
    {
        $phone = trim($this->phone);

        // Remove leading + if present
        if (str_starts_with($phone, '+')) {
            $phone = substr($phone, 1);
        }

        // Ensure it starts with 0
        if (!str_starts_with($phone, '0')) {
            $phone = '0' . ltrim($phone, '0');
        }

        return $phone;
    }

    // Reset form after successful submission
    public function resetForm(bool $keepNetwork = true): void
    {
        $this->phone = '';
        $this->amount = 100.0;
        $this->type = 'VTU';

        if (!$keepNetwork) {
            $this->network = 1;
        }

        $this->resetErrorBag();
    }
}
