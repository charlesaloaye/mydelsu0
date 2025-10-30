<div>
    <x-Header page="Login" />

    <div class="login-container">
        <div class="welcome-section">
            <h1>Welcome back!</h1>
            <p>Sign in to your {{ config('app.name') }} account to continue</p>
        </div>

        <div class="login-card">
            <form wire:submit='loginUser' id="loginForm">
                <x-input name='email' type='email' label='Email Address' icon='envelope' />

                <x-input name='password' type='password' label='Password' icon='lock' />

                <div class="remember-forgot">
                    <div class="remember-me">
                        <input type="checkbox" id="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a wire:navigate href="{{ route('auth.reset') }}" class="forgot-password">Forgot Password?</a>
                </div>

                <button wire:loading.attr='disabled' class="login-button">
                    <span wire:loading wire:target="loginUser">Please wait...</span>
                    <span wire:loading.remove wire:target="loginUser">Sign In.</span>
                </button>

                <div class="register-prompt">
                    Don't have an account? <a wire:navigate href="{{ route('auth.register') }}">Sign Up</a>
                </div>

                @if ($errors->any())

                    @foreach ($errors->all() as $errors)
                        <div class="alert alert-danger">
                            {{ $errors }}
                        </div>
                    @endforeach

                @endif
            </form>
        </div>
    </div>
</div>
