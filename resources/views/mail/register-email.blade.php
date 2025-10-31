@component('mail::message')
# Hello {{ $user->first_name }}!

Welcome to the **{{ config('app.name') }} community**!

We’re a team of both current and past students of DELSU who got tired of searching everywhere for basic DELSU information. So we built this platform to make life easier for every DELSUite — from aspiring students to proud graduates.

---

## ✅ Activate Your Account

To complete your registration and unlock full access to {{ config('app.name') }}, please contact our admin on WhatsApp to activate your account:

@php
    $whatsappMessage = 'Hi! I just registered on ' . config('app.name') . ' and need to activate my account. My email is ' . $user->email;
    $whatsappUrl = 'https://wa.me/2348XXXXXXXXX?text=' . urlencode($whatsappMessage);
@endphp

@component('mail::button', ['url' => $whatsappUrl])
💬 Contact Admin on WhatsApp →
@endcomponent

This quick verification helps us keep the community authentic and spam-free.

Once activated, you’ll have everything DELSU at your fingertips!

---

Thanks for joining us,  
**The {{ config('app.name') }} Team**
@endcomponent
