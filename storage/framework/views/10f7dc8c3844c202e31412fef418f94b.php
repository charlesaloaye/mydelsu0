<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
    <!--[if BLOCK]><![endif]--><?php if($step === 'forgot'): ?>
        <h2 class="text-xl font-bold mb-4">Forgot Password</h2>
        <input type="email" wire:model="email" placeholder="Enter your email" class="w-full p-2 border rounded mb-3">
        <button wire:click="sendResetLink" class="w-full bg-blue-500 text-white p-2 rounded">
            Send Reset Link
        </button>
    <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

    <!--[if BLOCK]><![endif]--><?php if($step === 'reset'): ?>
        <h2 class="text-xl font-bold mb-4">Reset Password</h2>
        <input type="email" wire:model="email" placeholder="Email" class="w-full p-2 border rounded mb-3">

        <input type="password" wire:model="password" placeholder="New Password" class="w-full p-2 border rounded mb-3">

        <input type="password" wire:model="password_confirmation" placeholder="Confirm Password"
            class="w-full p-2 border rounded mb-3">

        <button wire:click="resetPassword" class="w-full bg-green-500 text-white p-2 rounded">
            Reset Password
        </button>
    <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

    <!--[if BLOCK]><![endif]--><?php if(session()->has('message')): ?>
        <div class="mt-3 text-green-600"><?php echo e(session('message')); ?></div>
    <?php endif; ?><!--[if ENDBLOCK]><![endif]-->

    <?php if(session()->has('error')): ?>
        <div class="mt-3 text-red-600"><?php echo e(session('error')); ?></div>
    <?php endif; ?><!--[if ENDBLOCK]><![endif]-->
</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/livewire/reset-password.blade.php ENDPATH**/ ?>