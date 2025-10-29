<div>
    <div class="login-container">
        <div class="welcome-section">
            <h1>Purchase Airtime</h1>
            <p>Please fill in the details below to purchase airtime.</p>
        </div>

        <div class="login-card">
            <form wire:submit.prevent="sendAirtime" class="airtime-form">

                {{-- Network Select --}}
                <x-input action='airtime' label="Select Network:" name="network" type="select"
                    select_message="Choose Network">
                    <option value="1">MTN</option>
                    <option value="2">Glo</option>
                    <option value="3">9mobile</option>
                    <option value="4">Airtel</option>
                </x-input>

                {{-- Phone Number --}}
                <x-input name="phone" type="tel" label="Phone Number" icon="phone" />

                {{-- Amount --}}
                <x-input name="amount" type="number" label="Amount (₦)" icon="credit-card" />

                {{-- Submit Button --}}
                <x-button type="submit" class="" target="sendAirtime" defaultText="Buy Airtime"
                    loadingText="Processing..." />

            </form>

            {{-- General Error --}}
            @if ($form->message)
                <div class="alert alert-{{ $form->status }} mt-3">
                    {{ $form->message }}
                </div>
            @endif
        </div>
    </div>
</div>
