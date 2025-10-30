@props([
    'type' => 'submit',
    'target' => '',
    'fullWidth' => true,
    'defaultText' => 'Login',
    'loadingText' => 'Please wait...',
])

<div>
    <button wire:loading.attr="disabled" type="{{ $type }}"
        class="btn-eleven fw-500 tran3s d-block mt-20 p-3 login-button {{ $fullWidth ? 'w-100' : '' }}"
        {{ $attributes->merge(['class' => 'btn-eleven fw-500 tran3s']) }}>

        {{-- Default Text (shows when not loading) --}}
        <span wire:loading.remove wire:target='{{ $target }}'>
            {{ $defaultText }}
        </span>

        {{-- Loading Text (shows when loading) --}}
        <span wire:loading wire:target='{{ $target }}'>
            {{ $loadingText }} <i class="fa-solid fa-spinner fa-spin"></i>
        </span>

    </button>
</div>
