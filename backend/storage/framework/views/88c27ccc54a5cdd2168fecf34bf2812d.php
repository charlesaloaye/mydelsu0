<header class="dashboard-header">
    <div class="d-flex align-items-center justify-content-end">
        <button class="dash-mobile-nav-toggler d-block d-md-none me-auto">
            <span></span>
        </button>
        
        <div class="profile-notification ms-2 ms-md-5 me-4">
            <button class="noti-btn dropdown-toggle" type="button" id="notification-dropdown" data-bs-toggle="dropdown"
                data-bs-auto-close="outside" aria-expanded="false">
                <?php if (isset($component)) { $__componentOriginalce262628e3a8d44dc38fd1f3965181bc = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalce262628e3a8d44dc38fd1f3965181bc = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.icon','data' => ['name' => 'bell']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('icon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'bell']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalce262628e3a8d44dc38fd1f3965181bc)): ?>
<?php $attributes = $__attributesOriginalce262628e3a8d44dc38fd1f3965181bc; ?>
<?php unset($__attributesOriginalce262628e3a8d44dc38fd1f3965181bc); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalce262628e3a8d44dc38fd1f3965181bc)): ?>
<?php $component = $__componentOriginalce262628e3a8d44dc38fd1f3965181bc; ?>
<?php unset($__componentOriginalce262628e3a8d44dc38fd1f3965181bc); ?>
<?php endif; ?>
                <div class="badge-pill">
                </div>
            </button>
            <ul class="dropdown-menu" aria-labelledby="notification-dropdown">
                <li>
                    <h4>Notification</h4>
                    <ul class="style-none notify-list">
                        <li class="d-flex align-items-center unread">
                            <img src="https://html.creativegigstf.com/jobi/jobi/images/lazy.svg"
                                data-src="images/icon/icon_36.svg" alt="" class="lazy-img icon">
                            <div class="flex-fill ps-2">
                                <h6>You have 3 new mails</h6>
                                <span class="time">3 hours ago</span>
                            </div>
                        </li>
                        <li class="d-flex align-items-center">
                            <img src="https://html.creativegigstf.com/jobi/jobi/images/lazy.svg"
                                data-src="images/icon/icon_37.svg" alt="" class="lazy-img icon">
                            <div class="flex-fill ps-2">
                                <h6>Your job post has been approved</h6>
                                <span class="time">1 day ago</span>
                            </div>
                        </li>
                        <li class="d-flex align-items-center unread">
                            <img src="https://html.creativegigstf.com/jobi/jobi/images/lazy.svg"
                                data-src="images/icon/icon_38.svg" alt="" class="lazy-img icon">
                            <div class="flex-fill ps-2">
                                <h6>Your meeting is cancelled</h6>
                                <span class="time">3 days ago</span>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div><a href="#" class="job-post-btn tran3s">Add Question
            </a></div>
    </div>
</header>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/admin/header.blade.php ENDPATH**/ ?>