<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?php echo e($title ?? 'Home' . ' | ' . config('app.name')); ?></title>

    <link rel="icon" type="image/png" sizes="56x56" href="<?php echo e(asset('images/fav-icon/icon.png')); ?>">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" type="text/css" href="<?php echo e(asset('css/bootstrap.min.css')); ?>" media="all">
    <!-- Main style sheet -->
    <link rel="stylesheet" type="text/css" href="<?php echo e(asset('css/style.min.css')); ?>" media="all">
    <!-- responsive style sheet -->
    <link rel="stylesheet" type="text/css" href="<?php echo e(asset('css/responsive.css')); ?>" media="all">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
    <style>
        .text-primary {
            color: #2272b1 !important;
        }

        .btn-primary {
            background: #2272b1 !important;
        }
    </style>

    <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.js'); ?>
</head>

<body>
    <?php echo e($slot); ?>


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

    <!-- Optional JavaScript _____________________________  -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- jQuery first, then Bootstrap JS -->
    <!-- jQuery -->
    <script src="<?php echo e(asset('vendor/jquery.min.js')); ?>"></script>
    <!-- Bootstrap JS -->
    <script src="<?php echo e(asset('vendor/bootstrap/js/bootstrap.bundle.min.js')); ?>"></script>
    <!-- WOW js -->
    <script src="<?php echo e(asset('vendor/wow/wow.min.js')); ?>"></script>
    <!-- Slick Slider -->
    <script src="<?php echo e(asset('vendor/slick/slick.min.js')); ?>"></script>
    <!-- Fancybox -->
    <script src="<?php echo e(asset('vendor/fancybox/dist/jquery.fancybox.min.js')); ?>"></script>
    <!-- Lazy -->
    <script src="<?php echo e(asset('vendor/jquery.lazy.min.js')); ?>"></script>
    <!-- js Counter -->
    <script src="<?php echo e(asset('vendor/jquery.counterup.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/jquery.waypoints.min.js')); ?>"></script>
    <!-- Nice Select -->
    <script src="<?php echo e(asset('vendor/nice-select/jquery.nice-select.min.js')); ?>"></script>
    <!-- validator js -->
    <script src="<?php echo e(asset('vendor/validator.js')); ?>"></script>

    <!-- Theme js -->
    <script src="<?php echo e(asset('js/theme.js')); ?>"></script>

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
</body>

</html>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/AdminHomeLayout.blade.php ENDPATH**/ ?>