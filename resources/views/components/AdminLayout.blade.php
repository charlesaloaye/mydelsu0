<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ $title ?? 'Home' . ' | ' . config('app.name') }}</title>

    <link rel="icon" type="image/png" sizes="56x56" href="{{ asset('images/fav-icon/icon.png') }}">

    @assets
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/style.min.css?all=') . rand() }}">
        <link rel="stylesheet" href="{{ asset('css/responsive.css?all=') . rand() }}">
    @endassets

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />

    @vite('resources/js/app.js')
    @livewireStyles
</head>

<body>
    <div class="main-page-wrapper">
        @include('components.admin.sidebar')

        <div class="dashboard-body">
            <div class="position-relative">
                @include('components.admin.header')

                {{ $slot }}
            </div>
        </div>
    </div>


    <!-- Scripts -->
    <script src="{{ asset('vendor/jquery.min.js') }}"></script>
    <script src="{{ asset('vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>

    <!-- Other Vendor Scripts -->
    <script src="{{ asset('vendor/wow/wow.min.js') }}"></script>
    <script src="{{ asset('vendor/slick/slick.min.js') }}"></script>
    <script src="{{ asset('vendor/fancybox/dist/jquery.fancybox.min.js') }}"></script>
    <script src="{{ asset('vendor/jquery.lazy.min.js') }}"></script>
    <script src="{{ asset('vendor/jquery.counterup.min.js') }}"></script>
    <script src="{{ asset('vendor/jquery.waypoints.min.js') }}"></script>
    <script src="{{ asset('vendor/nice-select/jquery.nice-select.min.js') }}"></script>
    <script src="{{ asset('vendor/validator.js') }}"></script>
    <script src="{{ asset('js/theme.js') }}"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    @if (session()->has('success'))
        <script>
            Swal.fire({
                title: "{{ session('success') }}",
                icon: "success"
            });
        </script>
    @endif

    @if (session()->has('error'))
        <script>
            Swal.fire({
                title: "{{ session('error') }}",
                icon: "error"
            });
        </script>
    @endif

    {{-- @livewireScripts --}}

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
