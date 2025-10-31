<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?php echo e($title ?? 'Home' . ' | ' . config('app.name')); ?></title>

    <link rel="icon" type="image/png" sizes="56x56" href="<?php echo e(asset('images/fav-icon/icon.png')); ?>">

        <?php
        $__assetKey = '1031628882-0';

        ob_start();
    ?>
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="<?php echo e(asset('css/bootstrap.min.css')); ?>">
        <link rel="stylesheet" href="<?php echo e(asset('css/style.min.css?all=') . rand()); ?>">
        <link rel="stylesheet" href="<?php echo e(asset('css/responsive.css?all=') . rand()); ?>">
        <?php
        $__output = ob_get_clean();

        // If the asset has already been loaded anywhere during this request, skip it...
        if (in_array($__assetKey, \Livewire\Features\SupportScriptsAndAssets\SupportScriptsAndAssets::$alreadyRunAssetKeys)) {
            // Skip it...
        } else {
            \Livewire\Features\SupportScriptsAndAssets\SupportScriptsAndAssets::$alreadyRunAssetKeys[] = $__assetKey;

            // Check if we're in a Livewire component or not and store the asset accordingly...
            if (isset($this)) {
                \Livewire\store($this)->push('assets', $__output, $__assetKey);
            } else {
                \Livewire\Features\SupportScriptsAndAssets\SupportScriptsAndAssets::$nonLivewireAssets[$__assetKey] = $__output;
            }
        }
    ?>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />

    <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.js'); ?>
    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::styles(); ?>

</head>

<body>
    <div class="main-page-wrapper">
        <?php echo $__env->make('components.admin.sidebar', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

        <div class="dashboard-body">
            <div class="position-relative">
                <?php echo $__env->make('components.admin.header', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

                <?php echo e($slot); ?>

            </div>
        </div>
    </div>


    <!-- Scripts -->
    <script src="<?php echo e(asset('vendor/jquery.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/bootstrap/js/bootstrap.bundle.min.js')); ?>"></script>

    <!-- Other Vendor Scripts -->
    <script src="<?php echo e(asset('vendor/wow/wow.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/slick/slick.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/fancybox/dist/jquery.fancybox.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/jquery.lazy.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/jquery.counterup.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/jquery.waypoints.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/nice-select/jquery.nice-select.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/validator.js')); ?>"></script>
    <script src="<?php echo e(asset('js/theme.js')); ?>"></script>

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
        document.addEventListener('livewire:navigated', () => {
            Livewire.hook('message.processed', () => {
                setTimeout(() => {
                    // Bootstrap components
                    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                        new bootstrap.Tooltip(el);
                    });

                    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
                        new bootstrap.Dropdown(el);
                    });

                    // WOW.js
                    if (typeof WOW !== 'undefined') {
                        new WOW().init();
                    }

                    // Fancybox
                    if (window.Fancybox) {
                        Fancybox.bind("[data-fancybox]", {});
                    }

                    // Nice Select
                    if ($('.nice-select').length > 0) {
                        $('.nice-select').niceSelect();
                    }

                    // Lazy Load
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

                    // Slick Slider
                    if ($('.slick-slider').length > 0 && typeof $.fn.slick !== 'undefined') {
                        $('.slick-slider').slick('setPosition');
                    }
                }, 50);
            });
        });
    </script>

</body>

</html>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/AdminLayout.blade.php ENDPATH**/ ?>