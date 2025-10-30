@props(['login' => true, 'register' => false, 'title'])
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Home' }} - {{ config('app.name') }}</title>
    {{--
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"> --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    @guest
        <link rel="stylesheet" href="{{ asset('styles/login.css') }}?random={{ time() }}">
        <link rel="stylesheet" href="{{ asset('styles/register.css') }}?random={{ time() }}">
        <link rel="stylesheet" href="{{ asset('styles/reset.css') }}">
    @endguest

    @vite(['resources/js/app.js'])

    @livewireStyles


</head>

<body class="bg-light d-flex flex-column min-vh-100">

    <main class="container my-5 flex-grow-1">
        <div>
            {{ $slot }}
        </div>
    </main>
    <!-- Footer -->
    <x-Footer />

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
    @guest
        <script src="{{ asset('scripts/login.js') }}"></script>
        <script src="{{ asset('scripts/register.js') }}"></script>
        <script src="{{ asset('scripts/reset.js') }}"></script>
    @endguest


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

    @livewireScripts

</body>

</html>
