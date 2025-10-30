<div class="card mt-4">
    <div class="card-header">Payment History</div>
    <div class="card-body table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Reference</th>
                    <th>Amount (₦)</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <!--[if BLOCK]><![endif]--><?php $__empty_1 = true; $__currentLoopData = $payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <tr>
                        <td><?php echo e($payment->type); ?></td>
                        <td>₦<?php echo e(number_format($payment->amount / 100, 2)); ?></td>
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
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/payment-history.blade.php ENDPATH**/ ?>