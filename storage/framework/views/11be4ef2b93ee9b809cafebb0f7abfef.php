<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'type' => 'submit',
    'target' => '',
    'fullWidth' => true,
    'defaultText' => 'Login',
    'loadingText' => 'Please wait...',
]));

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

foreach (array_filter(([
    'type' => 'submit',
    'target' => '',
    'fullWidth' => true,
    'defaultText' => 'Login',
    'loadingText' => 'Please wait...',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>

<div>
    <button wire:loading.attr="disabled" type="<?php echo e($type); ?>"
        class="btn-eleven fw-500 tran3s d-block mt-20 p-3 login-button <?php echo e($fullWidth ? 'w-100' : ''); ?>"
        <?php echo e($attributes->merge(['class' => 'btn-eleven fw-500 tran3s'])); ?>>

        
        <span wire:loading.remove wire:target='<?php echo e($target); ?>'>
            <?php echo e($defaultText); ?>

        </span>

        
        <span wire:loading wire:target='<?php echo e($target); ?>'>
            <?php echo e($loadingText); ?> <i class="fa-solid fa-spinner fa-spin"></i>
        </span>

    </button>
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/button.blade.php ENDPATH**/ ?>