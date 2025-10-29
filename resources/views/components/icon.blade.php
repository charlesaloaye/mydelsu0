@props(['name', 'class' => ''])

<div class="icon rounded-circle d-flex align-items-center justify-content-center">
    <span class="fa fa-{{ $name }} {{ $class }}"></span>
</div>
