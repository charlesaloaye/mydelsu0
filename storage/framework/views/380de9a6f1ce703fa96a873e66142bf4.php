<div>
    <?php if (isset($component)) { $__componentOriginaled6f415a085a00e13eedf7cab9e75398 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginaled6f415a085a00e13eedf7cab9e75398 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.Header','data' => ['page' => 'Reset']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('Header'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['page' => 'Reset']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginaled6f415a085a00e13eedf7cab9e75398)): ?>
<?php $attributes = $__attributesOriginaled6f415a085a00e13eedf7cab9e75398; ?>
<?php unset($__attributesOriginaled6f415a085a00e13eedf7cab9e75398); ?>
<?php endif; ?>
<?php if (isset($__componentOriginaled6f415a085a00e13eedf7cab9e75398)): ?>
<?php $component = $__componentOriginaled6f415a085a00e13eedf7cab9e75398; ?>
<?php unset($__componentOriginaled6f415a085a00e13eedf7cab9e75398); ?>
<?php endif; ?>

    <div class="forgot-password-container">
        <div class="welcome-section">
            <h1>Reset Your Password</h1>
            <p>Follow these steps to reset your password and regain access to your account.</p>
        </div>

        <div class="forgot-password-card">
            <!-- Step Indicators -->
            <div class="steps-container">
                <div class="step <?php echo e($step === 1 ? 'active' : ''); ?>">
                    <div class="step-number">1</div>
                    <div class="step-label">Verify Email</div>
                </div>
                <div class="step <?php echo e($step === 2 ? 'active' : ''); ?>">
                    <div class="step-number">2</div>
                    <div class="step-label">Enter Code</div>
                </div>
                <div class="step <?php echo e($step === 3 ? 'active' : ''); ?>">
                    <div class="step-number">3</div>
                    <div class="step-label">New Password</div>
                </div>
            </div>

            <!-- Success Message -->
            <!--[if BLOCK]><![endif]--><?php if($step === 4): ?>
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    Your password has been successfully reset.
                    <a href="<?php echo e(route('login')); ?>" wire:navigate>Login with your new password</a>
                </div>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

            <!-- Step 1: Enter Email -->
            <!--[if BLOCK]><![endif]--><?php if($step === 1): ?>
                <form wire:submit.prevent="sendVerificationCode">
                    <div class="form-group">
                        <label for="email">Enter your registered email address</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-envelope"></i></span>
                            <input type="email" wire:model="email" placeholder="Enter your email address" required>
                        </div>
                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <div class="error-message"><?php echo e($message); ?></div>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>

                    <button class="button">Send Verification Code</button>

                    <div class="form-note">
                        Remember your password?
                        <a href="<?php echo e(route('login')); ?>" wire:navigate>Login here</a>
                    </div>
                </form>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

            <!-- Step 2: Enter Verification Code -->
            <!--[if BLOCK]><![endif]--><?php if($step === 2): ?>
                <form wire:submit.prevent="verifyCode">
                    <div class="form-group">
                        <label>Enter the 6-digit code sent to your email</label>
                        <input type="text" wire:model="code" maxlength="6" placeholder="Enter code"
                            class="code-input" style="width: 100%">
                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['code'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <div class="error-message"><?php echo e($message); ?></div>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>

                    <button type="submit" class="button">Verify Code</button>

                    <div class="form-note">
                        <a href="#" wire:click.prevent="$set('step', 1)">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                </form>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

            <!-- Step 3: New Password -->
            <!--[if BLOCK]><![endif]--><?php if($step === 3): ?>
                <form wire:submit.prevent="resetPassword">
                    <div class="form-group">
                        <label for="newPassword">Create New Password</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-lock"></i></span>
                            <input type="password" wire:model="newPassword" placeholder="Enter new password" required>
                        </div>
                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['newPassword'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <div class="error-message"><?php echo e($message); ?></div>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <div class="input-field">
                            <span class="icon"><i class="fas fa-lock"></i></span>
                            <input type="password" wire:model="confirmPassword" placeholder="Confirm new password"
                                required>
                        </div>
                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['confirmPassword'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <div class="error-message"><?php echo e($message); ?></div>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>

                    <button type="submit" class="button">Reset Password</button>

                    <div class="form-note">
                        <a href="#" wire:click.prevent="$set('step', 2)">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                    </div>
                </form>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
        </div>
    </div>
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/auth/reset-password.blade.php ENDPATH**/ ?>