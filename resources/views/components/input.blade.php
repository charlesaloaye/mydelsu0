@props([
    'label' => 'Email Address',
    'icon' => 'envelope',
    'type' => 'text',
    'name' => '',
    'select_message' => 'Select your status',
    'action' => '',
])

@if ($type === 'select')
    <div class="form-group">
        <label for="{{ $name }}">{{ $label }}</label>
        <div class="input-field">

            @if ($action === 'data' || $action === 'airtime')
                <select class="input-group-meta position-relative mb-25 form-control p-3 w-100 rounded"
                    wire:model.live="form.{{ $name }}" id="{{ $name }}">
                    <option value="0">{{ $select_message }}</option>
                    {{ $slot }}
                </select>
            @else
                <select class="input-group-meta position-relative mb-25 form-control p-3 w-100 rounded"
                    wire:model="form.{{ $name }}" id="{{ $name }}">
                    <option value="">{{ $select_message }}</option>
                    {{ $slot }}
                </select>
            @endif


        </div>

        @error("form.$name")
            <div class="text-danger fw-bold" id="{{ $name }}Error">{{ $message }}</div>
        @enderror
    </div>
@endif

@if ($type === 'checkbox')
    <div class="text-left mt-5">
        <label for="{{ $name }}" class="text-left">
            <input wire:model="form.{{ $name }}" type="checkbox" id="{{ $name }}">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            I understand that myDELSU will process my information in accordance with these terms.
        </label>
    </div>
    @error("form.$name")
        <div class="text-danger fw-bold" id="{{ $name }}Error">{{ $message }}</div>
    @enderror
@endif

@if ($type !== 'select' && $type !== 'checkbox' && $type !== 'radio')
    <div class="form-group">
        <label for="{{ $name }}">{{ $label }}</label>
        <div class="input-field">
            <span class="icon">
                <i class="fas fa-{{ $icon }}"></i>
            </span>
            <input wire:model="form.{{ $name }}" type="{{ $type }}" id="{{ $name }}"
                placeholder="Enter your {{ Str::replace('_', ' ', $name) }}">

            @if ($name === 'password' || $name === 'password_confirmation')
                <span class="password-toggle" onclick="togglePassword('{{ $name }}')">
                    <i id="{{ $name }}Icon" class="fas fa-eye"></i>
                </span>
            @endif

        </div>

        @error("form.$name")
            <div class="text-danger fw-bold" id="{{ $name }}Error">{{ $message }}</div>
        @enderror
    </div>
@endif
