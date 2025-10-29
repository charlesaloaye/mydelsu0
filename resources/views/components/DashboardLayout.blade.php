@props(['login' => true, 'register' => false, 'title'])
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Home' }} - myDELSU</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    @if ($title == 'Home')
        <link rel="stylesheet" href="{{ asset('styles/home.css') }}?=rand={{ rand(1, 1000) }}">
    @endif

    @auth
        @if ($title != 'Activate Account')
            <link rel="stylesheet" href="{{ asset('styles/dashboard.css') }}">
            <link rel="stylesheet" href="{{ asset('styles/coming-soon.css') }}">
            <link rel="stylesheet" href="{{ asset('styles/login.css') }}">
        @endif
        <link rel="stylesheet" href="{{ asset('styles/activate.css') }}">
    @endauth

    @livewireStyles
    @vite('resources/js/app.js')

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
    @auth
        @if ($title === 'Dashboard')
            <x-DashboardHeader />
            <x-dashboard.sidebar />
            <x-dashboard.user />
        @endif
    @endauth

    {{ $slot }}

    @if (!in_array($title, ['Activate Account', 'CGPA Calculator', 'Another Guest Page']))
        <x-dashboard.footerNav />
    @endif

    @if ($title == 'Activate Account')
        <script src="{{ asset('scripts/activate.js') }}"></script>
    @endif

    <script src="{{ asset('scripts/dashboard.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>


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

    @livewireScripts
</body>

</html>
