<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 class="main-title m0">Users</h2>
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
                        <th>Email</th>
                        <th>Balance</th>
                        <th>Verified</th>
                        
                        <th>Actions</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody class="border-0">
                    <!--[if BLOCK]><![endif]--><?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr wire:key="user-<?php echo e($user->id); ?>">
                            <td><?php echo e($loop->iteration); ?>.</td>
                            <td><?php echo e($user->first_name); ?> <?php echo e($user->last_name); ?></td>
                            <td><?php echo e($user->email); ?></td>

                            <td>&#8358;<?php echo e(number_format($user->balance, 2)); ?></td>
                            
                            <td>
                                <span class="<?php echo e($user->is_verified ? 'text-success' : 'text-danger'); ?>">
                                    <?php echo e($user->is_verified ? 'Yes' : 'No'); ?>

                                </span>
                            </td>

                            
                            <td>
                                <!--[if BLOCK]><![endif]--><?php if($editingUserId === $user->id): ?>
                                    <button wire:click="cancelEdit" class="btn btn-sm btn-secondary">Cancel</button>
                                <?php else: ?>
                                    <button
                                        wire:click="updateUserStatus(<?php echo e($user->id); ?>, <?php echo e($user->is_verified ? 0 : 1); ?>)"
                                        class="btn btn-sm <?php echo e($user->is_verified ? 'btn-danger' : 'btn-success'); ?>">
                                        <?php echo e($user->is_verified ? 'Deactivate' : 'Activate'); ?>

                                    </button>
                                <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

                            </td>

                            <td>
                                <!--[if BLOCK]><![endif]--><?php if($user->is_verified): ?>
                                    <a wire:navigate href="<?php echo e(route('admin.user.fund', $user->id)); ?>"
                                        class="btn btn-sm btn-info">
                                        Fund User
                                    </a>
                                <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
                            </td>


                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><!--[if ENDBLOCK]><![endif]-->
                </tbody>
            </table>
            <?php echo e($users->links('pagination::bootstrap-5')); ?>

        </div>
    </div>
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/admin/users.blade.php ENDPATH**/ ?>