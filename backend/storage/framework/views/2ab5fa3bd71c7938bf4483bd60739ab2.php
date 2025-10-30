<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 class="main-title m0">All Transactions</h2>
        <div class="short-filter d-flex align-items-center ms-auto xs-mt-30">
            <input type="text" wire:model.debounce.500ms="search" class="form-control"
                placeholder="Search by name or email" />
        </div>
    </div>

    <div class="bg-white card-box border-20">
        <div class="table-responsive">
            <table class="table job-alert-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="border-0">
                    <!--[if BLOCK]><![endif]--><?php $__currentLoopData = $payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr wire:key="user-<?php echo e($payment->id); ?>">
                            <td><?php echo e($loop->iteration); ?>.</td>
                            <td><?php echo e($payment->user->first_name ?? ''); ?> <?php echo e($payment->user->last_name ?? ''); ?></td>
                            <td>&#8358;<?php echo e(number_format($payment->amount)); ?></td>

                            <td>&#8358;<?php echo e(number_format($payment->user->balance ?? 0.0)); ?></td>

                            <td>
                                <?php echo e($payment->description); ?>

                            </td>

                            <td>
                                <?php echo e($payment->naration); ?>

                            </td>

                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><!--[if ENDBLOCK]><![endif]-->
                </tbody>
            </table>
            <?php echo e($payments->links('pagination::bootstrap-5')); ?>

        </div>
    </div>
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/transactions.blade.php ENDPATH**/ ?>