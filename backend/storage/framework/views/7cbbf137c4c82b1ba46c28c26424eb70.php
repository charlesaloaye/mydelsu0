<div>
    

    
    <?php if (isset($component)) { $__componentOriginal8238976f7721b116508e2a741ce405d2 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal8238976f7721b116508e2a741ce405d2 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.dashboard.rewards','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dashboard.rewards'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal8238976f7721b116508e2a741ce405d2)): ?>
<?php $attributes = $__attributesOriginal8238976f7721b116508e2a741ce405d2; ?>
<?php unset($__attributesOriginal8238976f7721b116508e2a741ce405d2); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal8238976f7721b116508e2a741ce405d2)): ?>
<?php $component = $__componentOriginal8238976f7721b116508e2a741ce405d2; ?>
<?php unset($__componentOriginal8238976f7721b116508e2a741ce405d2); ?>
<?php endif; ?>
    

    <div style="margin-bottom: 75px !important;">

        <?php if (isset($component)) { $__componentOriginal6c9b19ab37dbfc4b6a8d5eed37edb598 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal6c9b19ab37dbfc4b6a8d5eed37edb598 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.dashboard.quickaccess','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dashboard.quickaccess'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal6c9b19ab37dbfc4b6a8d5eed37edb598)): ?>
<?php $attributes = $__attributesOriginal6c9b19ab37dbfc4b6a8d5eed37edb598; ?>
<?php unset($__attributesOriginal6c9b19ab37dbfc4b6a8d5eed37edb598); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal6c9b19ab37dbfc4b6a8d5eed37edb598)): ?>
<?php $component = $__componentOriginal6c9b19ab37dbfc4b6a8d5eed37edb598; ?>
<?php unset($__componentOriginal6c9b19ab37dbfc4b6a8d5eed37edb598); ?>
<?php endif; ?>

        <div class="card mt-4">
            <div class="card-header">Payment History</div>
            <div class="card-body table-responsive">
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!--[if BLOCK]><![endif]--><?php $__empty_1 = true; $__currentLoopData = $payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr>
                                <td><?php echo e(ucfirst($payment->type)); ?></td>
                                <td>₦<?php echo e(number_format($payment->amount / 100)); ?></td>
                                <td><?php echo e(ucfirst($payment->status)); ?></td>
                                <td><?php echo e($payment->created_at->format('d M, Y h:i A')); ?></td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <tr>
                                <td colspan="4">No payments found.</td>
                            </tr>
                        <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
                    </tbody>
                </table>

                
            </div>

            <div class="card-footer text-end">
                <?php echo e($payments->links('pagination::bootstrap-5')); ?>

            </div>
        </div>

    </div>

    
    
    

    
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/dashboard.blade.php ENDPATH**/ ?>