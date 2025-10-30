<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['page']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['page']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>
<header>
    <a href="<?php echo e(route('login')); ?>" style="text-decoration: none;" wire:navigate>
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <span><?php echo e(config('app.name')); ?></span>
        </div>
    </a>
    <div class="header-actions">


        <!--[if BLOCK]><![endif]--><?php if($page === 'Login'): ?>
            <a href="<?php echo e(route('auth.register')); ?>" wire:navigate class="btn-register">Register</a>
        <?php endif; ?><!--[if ENDBLOCK]><![endif]-->


        <!--[if BLOCK]><![endif]--><?php if($page === 'Register'): ?>
            <a href="<?php echo e(route('login')); ?>" wire:navigate class="btn-register">Login</a>
        <?php endif; ?><!--[if ENDBLOCK]><![endif]-->


        <!--[if BLOCK]><![endif]--><?php if($page === 'Reset'): ?>
            <a href="<?php echo e(route('login')); ?>" wire:navigate class="btn-register">Login</a>
        <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

    </div>
</header>
<?php /**PATH /Users/mac/Desktop/mydelsu/backend/resources/views/components/Header.blade.php ENDPATH**/ ?>