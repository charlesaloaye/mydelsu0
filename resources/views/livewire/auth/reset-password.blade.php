<div>
    <x-Header page="Reset" />

    <div class="forgot-password-container">
        <div class="welcome-section">
            <h1>Reset Your Password</h1>
            <p>Follow these steps to reset your password and regain access to your account.</p>
        </div>

        <div class="forgot-password-card">
            <!-- Step Indicators -->
            <div class="steps-container">
                <div class="step {{ $step === 1 ? 'active' : '' }}">
                    <div class="step-number">1</div>
                    <div class="step-label">Verify Email</div>
                </div>
                <div class="step {{ $step === 2 ? 'active' : '' }}">
                    <div class="step-number">2</div>
                    <div class="step-label">Enter Code</div>
                </div>
                <div class="step {{ $step === 3 ? 'active' : '' }}">
                    <div class="step-number">3</div>
                    <div class="step-label">New Password</div>
                </div>
            </div>

            <!-- Success Message -->
            @if ($step === 4)
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    Your password has been successfully reset.
                    <a href="{{ route('login') }}" wire:navigate>Login with your new password</a>
                </div>
            @endif

            <!-- Step 1: Enter Email -->
            @if ($step === 1)
                <form wire:submit.prevent="sendVerificationCode">
                    <div class="form-group">
                        <label for="email">Enter your registered email address</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-envelope"></i></span>
                            <input type="email" wire:model="email" placeholder="Enter your email address" required>
                        </div>
                        @error('email')
                            <div class="error-message">{{ $message }}</div>
                        @enderror
                    </div>

                    <button class="button">Send Verification Code</button>

                    <div class="form-note">
                        Remember your password?
                        <a href="{{ route('login') }}" wire:navigate>Login here</a>
                    </div>
                </form>
            @endif

            <!-- Step 2: Enter Verification Code -->
            @if ($step === 2)
                <form wire:submit.prevent="verifyCode">
                    <div class="form-group">
                        <label>Enter the 6-digit code sent to your email</label>
                        <input type="text" wire:model="code" maxlength="6" placeholder="Enter code"
                            class="code-input" style="width: 100%">
                        @error('code')
                            <div class="error-message">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="button">Verify Code</button>

                    <div class="form-note">
                        <a href="#" wire:click.prevent="$set('step', 1)">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                </form>
            @endif

            <!-- Step 3: New Password -->
            @if ($step === 3)
                <form wire:submit.prevent="resetPassword">
                    <div class="form-group">
                        <label for="newPassword">Create New Password</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-lock"></i></span>
                            <input type="password" wire:model="newPassword" placeholder="Enter new password" required>
                        </div>
                        @error('newPassword')
                            <div class="error-message">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-lock"></i></span>
                            <input type="password" wire:model="confirmPassword" placeholder="Confirm new password"
                                required>
                        </div>
                        @error('confirmPassword')
                            <div class="error-message">{{ $message }}</div>
                        @enderror
                    </div>

                    <button type="submit" class="button">Reset Password</button>

                    <div class="form-note">
                        <a href="#" wire:click.prevent="$set('step', 2)">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                </form>
            @endif
        </div>
    </div>
</div>
