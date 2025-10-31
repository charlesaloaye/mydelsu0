<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h2 class="main-title m-0">Referral Contests</h2>
        <div class="short-filter d-flex align-items-center ms-auto">
            <input type="text" wire:model.debounce.500ms="search" class="form-control"
                placeholder="Search by name or email" />
        </div>
    </div>

    

    <div class="bg-white card-box border-20">
        <div class="table-responsive">
            <table class="table job-alert-table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Referrer</th>
                        <th>Balance</th>
                        <th>Verified</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!--[if BLOCK]><![endif]--><?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr wire:key="user-<?php echo e($user->id); ?>-<?php echo e($user->is_verified); ?>">

                            <td><?php echo e($loop->iteration); ?>.</td>
                            <td><?php echo e($user->first_name); ?> <?php echo e($user->last_name); ?></td>
                            <td><?php echo e($user->email); ?></td>
                            <td>
                                <!--[if BLOCK]><![endif]--><?php if($user->referrer): ?>
                                    <?php echo e($user->referrer->first_name); ?> <?php echo e($user->referrer->last_name); ?>

                                <?php else: ?>
                                    N/A
                                <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
                            </td>
                            <td>&#8358;<?php echo e(number_format($user->balance, 2)); ?></td>
                            <td>
                                <span class="<?php echo e($user->is_verified ? 'text-success' : 'text-danger'); ?>">
                                    <?php echo e($user->is_verified ? 'Yes' : 'No'); ?>

                                </span>
                            </td>
                            <td>
                                <button
                                    wire:click="updateUserStatus(<?php echo e($user->id); ?>, <?php echo e($user->is_verified ? 0 : 1); ?>)"
                                    class="btn btn-sm <?php echo e($user->is_verified ? 'btn-danger' : 'btn-success'); ?>">
                                    <?php echo e($user->is_verified ? 'Deactivate' : 'Activate'); ?>

                                </button>
                            </td>

                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><!--[if ENDBLOCK]><![endif]-->
                </tbody>
            </table>
            <?php echo e($users->links()); ?>

        </div>
    </div>

    <!-- Confetti JS -->
    
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/admin/approval.blade.php ENDPATH**/ ?>