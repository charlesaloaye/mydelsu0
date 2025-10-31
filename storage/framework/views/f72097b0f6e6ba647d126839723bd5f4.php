
<!-- Ad code would go here -->


<!-- Footer Navigation -->
<?php if (isset($component)) { $__componentOriginal739672277e689ba437fb7acdd91b023c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal739672277e689ba437fb7acdd91b023c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.dashboard.footerNav','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dashboard.footerNav'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal739672277e689ba437fb7acdd91b023c)): ?>
<?php $attributes = $__attributesOriginal739672277e689ba437fb7acdd91b023c; ?>
<?php unset($__attributesOriginal739672277e689ba437fb7acdd91b023c); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal739672277e689ba437fb7acdd91b023c)): ?>
<?php $component = $__componentOriginal739672277e689ba437fb7acdd91b023c; ?>
<?php unset($__componentOriginal739672277e689ba437fb7acdd91b023c); ?>
<?php endif; ?>



<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/home/home-footer.blade.php ENDPATH**/ ?>