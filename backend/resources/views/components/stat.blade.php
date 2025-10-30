@props([
    'icon' => 'home',
    'value' => '1.7k+',
    'label' => 'Total Users',
])

<div class="col-lg-3 col-6">
    <div class="dash-card-one bg-white border-30 position-relative mb-15">
        <div class="d-sm-flex align-items-center justify-content-between">
            <div class="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                <x-icon name="{{ $icon }}" class="text-white" />
            </div>
            <div class="order-sm-0">
                <div class="value fw-500">{{ $value }}</div>
                <span>{{ $label }}</span>
            </div>
        </div>
    </div>
</div>
