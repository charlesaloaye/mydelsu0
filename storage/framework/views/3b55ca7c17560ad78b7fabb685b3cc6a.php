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
    <title><?php echo e($title ?? 'Home'); ?> - myDELSU</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <?php if($title == 'Home'): ?>
        <link rel="stylesheet" href="<?php echo e(asset('styles/home.css')); ?>?=rand=<?php echo e(rand(1, 1000)); ?>">
    <?php endif; ?>

    <?php if(auth()->guard()->check()): ?>
        <?php if($title != 'Activate Account'): ?>
            <link rel="stylesheet" href="<?php echo e(asset('styles/dashboard.css')); ?>">
            <link rel="stylesheet" href="<?php echo e(asset('styles/coming-soon.css')); ?>">
            <link rel="stylesheet" href="<?php echo e(asset('styles/login.css')); ?>">
        <?php endif; ?>
        <link rel="stylesheet" href="<?php echo e(asset('styles/activate.css')); ?>">
    <?php endif; ?>

    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::styles(); ?>

    <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.js'); ?>

    <style>
        .balance {
            margin-bottom: 25px;
            margin-left: 25px;
        }

        .text-decoration-none {
            text-decoration: none;
        }

        .text-muted {
            color: #6c757d;
        }
    </style>
</head>

<body>
    <?php if(auth()->guard()->check()): ?>
        <?php if($title === 'Dashboard'): ?>
            <?php if (isset($component)) { $__componentOriginal3aae809b5aa3d6bbbb24aaae86376acc = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3aae809b5aa3d6bbbb24aaae86376acc = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.DashboardHeader','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('DashboardHeader'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3aae809b5aa3d6bbbb24aaae86376acc)): ?>
<?php $attributes = $__attributesOriginal3aae809b5aa3d6bbbb24aaae86376acc; ?>
<?php unset($__attributesOriginal3aae809b5aa3d6bbbb24aaae86376acc); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3aae809b5aa3d6bbbb24aaae86376acc)): ?>
<?php $component = $__componentOriginal3aae809b5aa3d6bbbb24aaae86376acc; ?>
<?php unset($__componentOriginal3aae809b5aa3d6bbbb24aaae86376acc); ?>
<?php endif; ?>
            <?php if (isset($component)) { $__componentOriginal060abe2a9b4511e378911474e77b046d = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal060abe2a9b4511e378911474e77b046d = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.dashboard.sidebar','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dashboard.sidebar'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal060abe2a9b4511e378911474e77b046d)): ?>
<?php $attributes = $__attributesOriginal060abe2a9b4511e378911474e77b046d; ?>
<?php unset($__attributesOriginal060abe2a9b4511e378911474e77b046d); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal060abe2a9b4511e378911474e77b046d)): ?>
<?php $component = $__componentOriginal060abe2a9b4511e378911474e77b046d; ?>
<?php unset($__componentOriginal060abe2a9b4511e378911474e77b046d); ?>
<?php endif; ?>
            <?php if (isset($component)) { $__componentOriginale6391b1d4e655b6d009743d7549f8cdd = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginale6391b1d4e655b6d009743d7549f8cdd = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.dashboard.user','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dashboard.user'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginale6391b1d4e655b6d009743d7549f8cdd)): ?>
<?php $attributes = $__attributesOriginale6391b1d4e655b6d009743d7549f8cdd; ?>
<?php unset($__attributesOriginale6391b1d4e655b6d009743d7549f8cdd); ?>
<?php endif; ?>
<?php if (isset($__componentOriginale6391b1d4e655b6d009743d7549f8cdd)): ?>
<?php $component = $__componentOriginale6391b1d4e655b6d009743d7549f8cdd; ?>
<?php unset($__componentOriginale6391b1d4e655b6d009743d7549f8cdd); ?>
<?php endif; ?>
        <?php endif; ?>
    <?php endif; ?>

    <?php echo e($slot); ?>


    <?php if(!in_array($title, ['Activate Account', 'CGPA Calculator', 'Another Guest Page'])): ?>
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
    <?php endif; ?>

    <?php if($title == 'Activate Account'): ?>
        <script src="<?php echo e(asset('scripts/activate.js')); ?>"></script>
    <?php endif; ?>

    <script src="<?php echo e(asset('scripts/dashboard.js')); ?>"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>


    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <?php if(session()->has('success')): ?>
        <script>
            Swal.fire({
                title: "<?php echo e(session('success')); ?>",
                icon: "success"
            });
        </script>
    <?php endif; ?>

    <?php if(session()->has('error')): ?>
        <script>
            Swal.fire({
                title: "<?php echo e(session('error')); ?>",
                icon: "error"
            });
        </script>
    <?php endif; ?>
    <script>
        const swiperSlides = document.querySelectorAll('.swiper-slide');

        if (swiperSlides.length > 1) {
            new Swiper('.swiper', {
                loop: swiperSlides.length > 2, // Only loop if enough slides
                slidesPerView: 1,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                speed: 600
            });
        }
    </script>

    <script>
        document.addEventListener('livewire:navigated', () => {
            Livewire.hook('message.processed', () => {
                document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(
                    el));
                document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => new bootstrap
                    .Dropdown(el));

                if (typeof WOW !== 'undefined') new WOW().init();
                if (window.Fancybox) Fancybox.bind("[data-fancybox]", {});
                if (typeof $ !== 'undefined') {
                    if ($('.nice-select').length > 0) $('.nice-select').niceSelect();
                    if ($.fn.Lazy) $('.lazy').Lazy();
                    if (typeof $.fn.counterUp !== 'undefined') {
                        $('.counter').counterUp({
                            delay: 10,
                            time: 1000
                        });
                    }
                    if ($('.slick-slider').length > 0 && typeof $.fn.slick !== 'undefined') {
                        $('.slick-slider').slick('setPosition');
                    }
                }
            });
        });
    </script>

    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::scripts(); ?>

</body>

</html>
<?php /**PATH /Users/mac/Desktop/mydelsu/backend/resources/views/components/DashboardLayout.blade.php ENDPATH**/ ?>