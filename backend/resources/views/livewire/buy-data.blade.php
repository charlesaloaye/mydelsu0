<div>
    @if (!empty($form->response))
        <div style="color: {{ $form->response['status'] ?? false ? 'green' : 'red' }};">
            {{ $form->response['message'] ?? 'Unknown response' }}
        </div>
    @endif

    <div class="login-container">
        <div class="welcome-section">
            <h1>Purchase Data</h1>
            <p>Please fill in the details below to purchase data.</p>
        </div>
        <div class="login-card">

            @if (session()->has('success'))
                <div class="alert alert-success">{{ sesssion('success') }}</div>
            @endif

            <form wire:submit="buyDataButton">

                <div class="mb-4">
                    <x-input action='data' name="networkId" class="w-full border p-2 rounded" type='select'
                        select_message='Choose Network' label='Network'>
                        @foreach ($this->form->networks as $id => $name)
                            <option value="{{ $id }}">{{ $name }}</option>
                        @endforeach
                    </x-input>
                </div>

                {{-- {{ config('services.maskawa.token') }} --}}

                @if (!empty($this->form->plans))
                    <div class="mb-4">
                        <x-input action='data' name="planId" class="w-full border p-2 rounded" type='select'
                            select_message='Choose Plan' label='Data Plan'>
                            @foreach ($this->form->plans as $plan)
                                <option value="{{ $plan['id'] }}">
                                    ₦{{ number_format($plan['price']) }} - {{ $plan['size'] }} ({{ $plan['validity'] }})
                                </option>
                            @endforeach
                        </x-input>
                    </div>
                @endif


                {{-- Phone Number --}}
                <x-input name="mobileNumber" type="tel" label="Phone Number" icon="phone" />


                {{-- Submit Button --}}
                <x-button type="submit" class="" target="buyDataButton" defaultText="Buy Data"
                    loadingText="Processing..." />
            </form>
        </div>
    </div>
</div>
