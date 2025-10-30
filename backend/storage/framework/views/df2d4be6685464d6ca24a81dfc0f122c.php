<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['login' => true, 'register' => false, 'title']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['login' => true, 'register' => false, 'title']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($title ?? 'Home'); ?> - <?php echo e(config('app.name')); ?></title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <?php if(auth()->guard()->guest()): ?>
        <link rel="stylesheet" href="<?php echo e(asset('styles/login.css')); ?>?random=<?php echo e(time()); ?>">
        <link rel="stylesheet" href="<?php echo e(asset('styles/register.css')); ?>?random=<?php echo e(time()); ?>">
        <link rel="stylesheet" href="<?php echo e(asset('styles/reset.css')); ?>">
    <?php endif; ?>

    <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.js']); ?>

    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::styles(); ?>



</head>

<body class="bg-light d-flex flex-column min-vh-100">

    <main class="container my-5 flex-grow-1">
        <div>
            <?php echo e($slot); ?>

        </div>
    </main>
    <!-- Footer -->
    <?php if (isset($component)) { $__componentOriginal1a1b0b46746169d35e1b0264de6171df = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal1a1b0b46746169d35e1b0264de6171df = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.Footer','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('Footer'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal1a1b0b46746169d35e1b0264de6171df)): ?>
<?php $attributes = $__attributesOriginal1a1b0b46746169d35e1b0264de6171df; ?>
<?php unset($__attributesOriginal1a1b0b46746169d35e1b0264de6171df); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal1a1b0b46746169d35e1b0264de6171df)): ?>
<?php $component = $__componentOriginal1a1b0b46746169d35e1b0264de6171df; ?>
<?php unset($__componentOriginal1a1b0b46746169d35e1b0264de6171df); ?>
<?php endif; ?>

    <script>
        function togglePassword(fieldId) {
            const input = document.getElementById(fieldId);
            const icon = document.getElementById(fieldId + 'Icon');

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        }
    </script>
    <?php if(auth()->guard()->guest()): ?>
        <script src="<?php echo e(asset('scripts/login.js')); ?>"></script>
        <script src="<?php echo e(asset('scripts/register.js')); ?>"></script>
        <script src="<?php echo e(asset('scripts/reset.js')); ?>"></script>
    <?php endif; ?>


    <script>
        document.addEventListener('livewire:load', () => {
            // Fire on every Livewire DOM update
            Livewire.hook('message.processed', (message, component) => {
                // Re-initialize Bootstrap tooltips, popovers, etc.
                document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                    new bootstrap.Tooltip(el);
                });

                // WOW.js animation re-init (if needed)
                if (typeof WOW !== 'undefined') {
                    new WOW().init();
                }

                // Fancybox (if using dynamic images or links)
                if (window.Fancybox) {
                    Fancybox.bind("[data-fancybox]", {});
                }

                // Nice Select re-init
                if ($('.nice-select').length > 0) {
                    $('.nice-select').niceSelect();
                }

                // Lazy load images
                if ($.fn.Lazy) {
                    $('.lazy').Lazy();
                }

                // Counter
                if (typeof $.fn.counterUp !== 'undefined') {
                    $('.counter').counterUp({
                        delay: 10,
                        time: 1000
                    });
                }

                // Slick Slider (re-init if any dynamic sliders)
                if ($('.slick-slider').length > 0 && typeof $.fn.slick !== 'undefined') {
                    $('.slick-slider').slick('setPosition');
                }
            });
        });
    </script>

    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::scripts(); ?>


</body>

</html>
<?php /**PATH /Users/mac/Desktop/mydelsu/backend/resources/views/components/HomeLayout.blade.php ENDPATH**/ ?>