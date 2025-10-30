@props(['page'])
<header>
    <a href="{{ route('login') }}" style="text-decoration: none;" wire:navigate>
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <span>{{ config('app.name') }}</span>
        </div>
    </a>
    <div class="header-actions">


        @if ($page === 'Login')
            <a href="{{ route('auth.register') }}" wire:navigate class="btn-register">Register</a>
        @endif


        @if ($page === 'Register')
            <a href="{{ route('login') }}" wire:navigate class="btn-register">Login</a>
        @endif


        @if ($page === 'Reset')
            <a href="{{ route('login') }}" wire:navigate class="btn-register">Login</a>
        @endif

    </div>
</header>
