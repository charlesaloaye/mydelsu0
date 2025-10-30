<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-title">Menu</div>
        <div class="close-sidebar" id="closeSidebar">
            <i class="fas fa-times"></i>
        </div>
    </div>
    <ul class="sidebar-menu">
        <li><a href="#"><i class="fas fa-newspaper"></i> My DELSU News</a></li>
        <li><a href="#"><i class="fas fa-calendar-alt"></i> My Timetable</a></li>
        <li><a href="<?php echo e(route('cgpa.calculator')); ?>"><i class="fas fa-graduation-cap"></i> My CGPA</a></li>
        <li><a href="#"><i class="fas fa-question-circle"></i> My Past Questions</a></li>
        <li><a href="#"><i class="fas fa-calendar-check"></i> My Events</a></li>
        <li><a href="#"><i class="fas fa-file-alt"></i> My Documents</a></li>
        <li><a href="#"><i class="fas fa-user-plus"></i> My Referral</a></li>
        <li><a href="#"><i class="fas fa-headset"></i> My Support</a></li>
        <li><a href="#"><i class="fas fa-cog"></i> My Settings</a></li>
        <li><a wire:click='logout' href="<?php echo e(route('auth.logout')); ?>"><i class="fas fa-sign-out"></i>Logout</a></li>
    </ul>
</div><?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/dashboard/sidebar.blade.php ENDPATH**/ ?>