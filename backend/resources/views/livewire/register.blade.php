<div>
    <x-Header page="Register" />

    <div class="register-container">
        <div class="welcome-section">
            <h1>Create your Account</h1>
            <p>Join the {{ config('app.name') }} community today</p>
        </div>

        <div class="register-card">

            <form wire:submit.prevent="registerUser">

                @if ($errors->any())

                    @foreach ($errors->all() as $errors)
                        <div class="text-danger">
                            {{ $errors }}
                        </div>
                    @endforeach

                @endif

                @if (session()->has('success'))
                    <div class="text-success">
                        {{ session('success') }}
                    </div>
                @endif

                @if (session()->has('error'))
                    <div class="text-danger">
                        {{ session('error') }}
                    </div>
                @endif

                <x-input label='I am a/an:' name='type' type='select'>

                    <option value="aspirant">Aspirant
                        (Planning to
                        apply to DELSU)</option>
                    <option value="student">Current Student
                    </option>
                    <option value="alumni">Alumni (Former
                        Student) </option>

                </x-input>

                <x-input name='first_name' type='text' label='First Name' icon='user' />

                <x-input name='last_name' type='text' label='Last Name' icon='user' />

                <x-input name='phone' type='tel' label='Phone' icon='phone' />

                <x-input name='email' type='email' label='Email Address' icon='envelope' />

                <x-input name='password' type='password' label='Password' icon='lock' />

                <x-input name='password_confirmation' type='password' label='Confirm Password' icon='lock' />

                <x-input name='terms' type='checkbox' />

                <button wire:loading.attr='disabled' class="register-button">
                    <span wire:loading wire:target="registerUser">Please wait...</span>
                    <span wire:loading.remove wire:target="registerUser">Create Account.</span>
                </button>
            </form>

            <div class="login-prompt">
                Already have an account? <a wire:navigate href="{{ route('login') }}">Login</a>
            </div>
        </div>

    </div>


</div>
