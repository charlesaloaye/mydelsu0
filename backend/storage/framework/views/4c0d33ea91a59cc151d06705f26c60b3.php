<div wire:poll.visible.30000ms> <!-- Update 3secs -->
    <header>
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <span><?php echo e(config('app.name')); ?></span>
        </div>
        <div class="header-actions">
            <div class="user-avatar" id="userInitials"><?php echo e(substr(Auth::user()->first_name, 0, 1)); ?></div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="setup-container">
        <div class="setup-card">
            <!-- Large percentage counter -->
            <div class="percentage-counter" id="percentageCounter">0%</div>

            <!-- Setup message -->
            <div class="setup-message" id="setupMessage">Setting up your dashboard...</div>

            <!-- Loading bar -->
            <div class="loading-bar-container">
                <div class="loading-bar" id="loadingBar"></div>
            </div>

            <!-- WhatsApp activation button (initially hidden) -->
            <a href="<?php echo e(config('app.whatsapp')); ?>?text=I want to activate my account, my name is <?php echo e(Auth::user()->first_name); ?> <?php echo e(Auth::user()->last_name); ?>"
                class="whatsapp-button" id="whatsappButton">
                <i class="fab fa-whatsapp"></i> Activate Your Account
            </a>

            <!-- Activation note (initially hidden) -->
            <p class="activation-note" id="activationNote">
                Contact our admin on WhatsApp to verify and activate your account.
            </p>
        </div>
    </div>


</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/activate-user.blade.php ENDPATH**/ ?>