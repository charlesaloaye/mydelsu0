<div>
    <?php if (isset($component)) { $__componentOriginaled6f415a085a00e13eedf7cab9e75398 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginaled6f415a085a00e13eedf7cab9e75398 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.Header','data' => ['page' => 'Login']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('Header'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['page' => 'Login']); ?>
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

    <div class="login-container">
        <div class="welcome-section">
            <h1>Welcome back!</h1>
            <p>Sign in to your <?php echo e(config('app.name')); ?> account to continue</p>
        </div>

        <div class="login-card">
            <form wire:submit='loginUser' id="loginForm">
                <?php if (isset($component)) { $__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.input','data' => ['name' => 'email','type' => 'email','label' => 'Email Address','icon' => 'envelope']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'email','type' => 'email','label' => 'Email Address','icon' => 'envelope']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1)): ?>
<?php $attributes = $__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1; ?>
<?php unset($__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1)): ?>
<?php $component = $__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1; ?>
<?php unset($__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1); ?>
<?php endif; ?>

                <?php if (isset($component)) { $__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.input','data' => ['name' => 'password','type' => 'password','label' => 'Password','icon' => 'lock']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'password','type' => 'password','label' => 'Password','icon' => 'lock']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1)): ?>
<?php $attributes = $__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1; ?>
<?php unset($__attributesOriginalc2fcfa88dc54fee60e0757a7e0572df1); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1)): ?>
<?php $component = $__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1; ?>
<?php unset($__componentOriginalc2fcfa88dc54fee60e0757a7e0572df1); ?>
<?php endif; ?>

                <div class="remember-forgot">
                    <div class="remember-me">
                        <input type="checkbox" id="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a wire:navigate href="<?php echo e(route('auth.reset')); ?>" class="forgot-password">Forgot Password?</a>
                </div>

                <button wire:loading.attr='disabled' class="login-button">
                    <span wire:loading wire:target="loginUser">Please wait...</span>
                    <span wire:loading.remove wire:target="loginUser">Sign In.</span>
                </button>

                <div class="register-prompt">
                    Don't have an account? <a wire:navigate href="<?php echo e(route('auth.register')); ?>">Sign Up</a>
                </div>

                <!--[if BLOCK]><![endif]--><?php if($errors->any()): ?>

                    <!--[if BLOCK]><![endif]--><?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $errors): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="alert alert-danger">
                            <?php echo e($errors); ?>

                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><!--[if ENDBLOCK]><![endif]-->

                <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
            </form>
        </div>
    </div>
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/login.blade.php ENDPATH**/ ?>