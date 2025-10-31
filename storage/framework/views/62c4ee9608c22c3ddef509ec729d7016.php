<!-- User Info Section -->
<section class="user-info-section">
    <div class="user-details">
        <div class="user-avatar">
            <img src="<?php echo e(env('APP_USER_PROFILE')); ?>" alt="<?php echo e(Auth::user()->first_name); ?>">
        </div>
        <div class="user-name-rank">
            <div class="user-name">Hello <?php echo e(Auth::user()->first_name); ?>!</div>
            <span class="user-rank">🌟 <?php echo e(Str::upper(Auth::user()->type)); ?></span>
        </div>
    </div>
    <div class="user-balance">
        <div class="balance-label">
            Balance <a wire:click="$refresh"> <i class="fas fa-sync-alt"></i></a>
        </div>
        <div class="balance-amount">₦<?php echo e(number_format(Auth::user()->balance, 2)); ?></div>
    </div>
</section>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/dashboard/user.blade.php ENDPATH**/ ?>