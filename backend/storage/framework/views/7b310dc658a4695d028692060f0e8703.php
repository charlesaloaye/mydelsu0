<div>
    <div class="form-wrapper m-auto ">
        <form wire:submit="saveBalance(<?php echo e($user->id); ?>)" class="mt-10">
            <div class="text-center">
                <h2>Fund <?php echo e($user->first_name); ?> <?php echo e($user->last_name); ?>!</h2>
            </div>
            <div class="row">
                <div class="col-12 col-md-6 offset-md-3">

                    <div class="input-group-meta position-relative mb-25">
                        <label>Action*</label>
                        <select class="form-control p-3" wire:model='form.action' type="number" placeholder="5000">

                            <option value="">Select Action</option>
                            <option value="credit">Top up</option>
                            <option value="debit">Deduct</option>
                        </select>

                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['form.action'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <span class="text-danger"><?php echo e($message); ?></span>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>


                    <div class="input-group-meta position-relative mb-25">
                        <label>Amount*</label>
                        <input class="form-control p-3" wire:model='form.amount' type="number" placeholder="5000">
                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['form.amount'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <span class="text-danger"><?php echo e($message); ?></span>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>


                    <div class="input-group-meta position-relative mb-20">
                        <label>Reason*</label>
                        <input wire:model='form.reason' type="text" placeholder="Enter Reason"
                            class="pass_log_id form-control p-3">

                        <!--[if BLOCK]><![endif]--><?php $__errorArgs = ['form.reason'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <span class="text-danger"><?php echo e($message); ?></span>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><!--[if ENDBLOCK]><![endif]-->
                    </div>

                    <?php if (isset($component)) { $__componentOriginald0f1fd2689e4bb7060122a5b91fe8561 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginald0f1fd2689e4bb7060122a5b91fe8561 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.button','data' => ['target' => 'saveBalance('.e($user->id).')','defaultText' => 'Fund '.e($user->first_name).'','loadingText' => 'Please wait...']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('button'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['target' => 'saveBalance('.e($user->id).')','defaultText' => 'Fund '.e($user->first_name).'','loadingText' => 'Please wait...']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginald0f1fd2689e4bb7060122a5b91fe8561)): ?>
<?php $attributes = $__attributesOriginald0f1fd2689e4bb7060122a5b91fe8561; ?>
<?php unset($__attributesOriginald0f1fd2689e4bb7060122a5b91fe8561); ?>
<?php endif; ?>
<?php if (isset($__componentOriginald0f1fd2689e4bb7060122a5b91fe8561)): ?>
<?php $component = $__componentOriginald0f1fd2689e4bb7060122a5b91fe8561; ?>
<?php unset($__componentOriginald0f1fd2689e4bb7060122a5b91fe8561); ?>
<?php endif; ?>
                </div>
            </div>
        </form>

    </div>

</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/fund-user.blade.php ENDPATH**/ ?>