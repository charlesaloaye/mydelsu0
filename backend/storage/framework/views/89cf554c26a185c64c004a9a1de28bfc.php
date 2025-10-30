<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'label' => 'Email Address',
    'icon' => 'envelope',
    'type' => 'text',
    'name' => '',
    'select_message' => 'Select your status',
    'action' => '',
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
    'label' => 'Email Address',
    'icon' => 'envelope',
    'type' => 'text',
    'name' => '',
    'select_message' => 'Select your status',
    'action' => '',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>

<!--[if BLOCK]><![endif]--><?php if($type === 'select'): ?>
    <div class="form-group">
        <label for="<?php echo e($name); ?>"><?php echo e($label); ?></label>
        <div class="input-field">

            <!--[if BLOCK]><![endif]--><?php if($action === 'data' || $action === 'airtime'): ?>
                <select class="input-group-meta position-relative mb-25 form-control p-3 w-100 rounded"
                    wire:model.live="form.<?php echo e($name); ?>" id="<?php echo e($name); ?>">
                    <option value="0"><?php echo e($select_message); ?></option>
                    <?php echo e($slot); ?>

                </select>
            <?php else: ?>
                <select class="input-group-meta position-relative mb-25 form-control p-3 w-100 rounded"
                    wire:model="form.<?php echo e($name); ?>" id="<?php echo e($name); ?>">
                    <option value=""><?php echo e($select_message); ?></option>
                    <?php echo e($slot); ?>

                </select>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->


        </div>

        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ["form.$name"];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <div class="text-danger fw-bold" id="<?php echo e($name); ?>Error"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
    </div>
<?php endif; ?><!--[if ENDBLOCK]><![endif]-->

<!--[if BLOCK]><![endif]--><?php if($type === 'checkbox'): ?>
    <div class="text-left mt-5">
        <label for="<?php echo e($name); ?>" class="text-left">
            <input wire:model="form.<?php echo e($name); ?>" type="checkbox" id="<?php echo e($name); ?>">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            I understand that myDELSU will process my information in accordance with these terms.
        </label>
    </div>
    <!--[if BLOCK]><![endif]--><?php $__errorArgs = ["form.$name"];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <div class="text-danger fw-bold" id="<?php echo e($name); ?>Error"><?php echo e($message); ?></div>
    <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
<?php endif; ?><!--[if ENDBLOCK]><![endif]-->

<!--[if BLOCK]><![endif]--><?php if($type !== 'select' && $type !== 'checkbox' && $type !== 'radio'): ?>
    <div class="form-group">
        <label for="<?php echo e($name); ?>"><?php echo e($label); ?></label>
        <div class="input-field">
            <span class="icon">
                <i class="fas fa-<?php echo e($icon); ?>"></i>
            </span>
            <input wire:model="form.<?php echo e($name); ?>" type="<?php echo e($type); ?>" id="<?php echo e($name); ?>"
                placeholder="Enter your <?php echo e(Str::replace('_', ' ', $name)); ?>">

            <!--[if BLOCK]><![endif]--><?php if($name === 'password' || $name === 'password_confirmation'): ?>
                <span class="password-toggle" onclick="togglePassword('<?php echo e($name); ?>')">
                    <i id="<?php echo e($name); ?>Icon" class="fas fa-eye"></i>
                </span>
            <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

        </div>

        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ["form.$name"];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <div class="text-danger fw-bold" id="<?php echo e($name); ?>Error"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
    </div>
<?php endif; ?><!--[if ENDBLOCK]><![endif]-->
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/input.blade.php ENDPATH**/ ?>