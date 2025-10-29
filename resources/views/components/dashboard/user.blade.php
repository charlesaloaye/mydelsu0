<!-- User Info Section -->
<section class="user-info-section">
    <div class="user-details">
        <div class="user-avatar">
            <img src="{{ env('APP_USER_PROFILE') }}" alt="{{ Auth::user()->first_name }}">
        </div>
        <div class="user-name-rank">
            <div class="user-name">Hello {{ Auth::user()->first_name }}!</div>
            <span class="user-rank">🌟 {{ Str::upper(Auth::user()->type) }}</span>
        </div>
    </div>
    <div class="user-balance">
        <div class="balance-label">
            Balance <a wire:click="$refresh"> <i class="fas fa-sync-alt"></i></a>
        </div>
        <div class="balance-amount">₦{{ number_format(Auth::user()->balance, 2) }}</div>
    </div>
</section>
