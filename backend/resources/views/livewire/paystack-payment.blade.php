<div>
    <div class="login-container">
        <div class="welcome-section">
            <h1>Fund Your Account</h1>
            <p>Enter the amount you wish to pay</p>
        </div>
        <div class="login-card">

            <form wire:submit="makePayment">
                <div class="mb-3">
                    <x-input name="amount" type="number" label="Amount (₦)" icon="credit-card" />
                </div>

                <x-button type="submit" class="" target="makePayment" defaultText="Pay Now"
                    loadingText="Processing..." />
            </form>

            @error('form.amount')
                <div class="alert alert-danger">
                    {{ $message }}
                </div>
            @enderror
        </div>
    </div>
</div>
