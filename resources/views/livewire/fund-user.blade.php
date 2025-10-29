<div>
    <div class="form-wrapper m-auto ">
        <form wire:submit="saveBalance({{ $user->id }})" class="mt-10">
            <div class="text-center">
                <h2>Fund {{ $user->first_name }} {{ $user->last_name }}!</h2>
            </div>
            <div class="row">
                <div class="col-12 col-md-6 offset-md-3">

                    <div class="input-group-meta position-relative mb-25">
                        <label>Action*</label>
                        <select class="form-control p-3" wire:model='form.action' type="number" placeholder="5000">

                            <option value="">Select Action</option>
                            <option value="credit">Top up</option>
                            <option value="debit">Deduct</option>
                        </select>

                        @error('form.action')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>


                    <div class="input-group-meta position-relative mb-25">
                        <label>Amount*</label>
                        <input class="form-control p-3" wire:model='form.amount' type="number" placeholder="5000">
                        @error('form.amount')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>


                    <div class="input-group-meta position-relative mb-20">
                        <label>Reason*</label>
                        <input wire:model='form.reason' type="text" placeholder="Enter Reason"
                            class="pass_log_id form-control p-3">

                        @error('form.reason')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <x-button target='saveBalance({{ $user->id }})' defaultText='Fund {{ $user->first_name }}'
                        loadingText='Please wait...' />
                </div>
            </div>
        </form>

    </div>

</div>
