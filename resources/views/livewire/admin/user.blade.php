<div>
    <h2 class="main-title d-block d-lg-none">Profile</h2>


    <form wire:submit.prevent='updateUser'>
        <div class="bg-white card-box border-20">

            <div class="row">

                <div class="col-sm-6">
                    <div class="dash-input-wrapper mb-30">
                        <label for="">First Name*</label>
                        <input type="text" placeholder="Charles" wire:model="first_name">

                        @error('first_name')
                            <span class="text-danger fw-bold mt-2">{{ $message }}</span>
                        @enderror
                    </div>
                    <!-- /.dash-input-wrapper -->
                </div>
                <div class="col-sm-6">
                    <div class="dash-input-wrapper mb-30">
                        <label for="">Last Name*</label>
                        <input type="text" placeholder="Sedenu" wire:model="last_name">
                        @error('last_name')
                            <span class="text-danger fw-bold mt-2">{{ $message }}</span>
                        @enderror
                    </div>
                    <!-- /.dash-input-wrapper -->
                </div>
                <div class="col-sm-6">
                    <div class="dash-input-wrapper mb-30">
                        <label for="">Email*</label>
                        <input type="email" placeholder="mail@domain.com" wire:model="email">
                        @error('email')
                            <span class="text-danger fw-bold mt-2">{{ $message }}</span>
                        @enderror
                    </div>
                    <!-- /.dash-input-wrapper -->
                </div>

                {{-- <div class="col-sm-6">
                    <div class="dash-input-wrapper mb-30">
                        <label for="">Phone Number*</label>
                        <input type="tel" placeholder="+880 01723801729" wire:model="phone">
                    </div>
                </div> --}}
                <div class="col-sm-6">
                    <div class="dash-input-wrapper mb-30">
                        <label for="">Website*</label>
                        <input type="text" placeholder="http://charlestechy.cv/" wire:model="website">
                        @error('website')
                            <span class="text-danger fw-bold mt-2">{{ $message }}</span>
                        @enderror
                    </div>
                    <!-- /.dash-input-wrapper -->
                </div>
                <div class="col-12">
                    <div class="dash-input-wrapper">
                        <label for="">About*</label>
                        <textarea class="size-lg" placeholder="" wire:model="bio"></textarea>
                        <div class="alert-text">Brief description for your profile. URLs are hyperlinked.</div>
                        @error('bio')
                            <span class="text-danger fw-bold mt-2">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
            </div>


            <div class="button-group d-inline-flex align-items-center mt-30">
                <button type="submit" wire:loading.attr='disabled' class="dash-btn-two tran3s me-3 btn">
                    <span class="alert-alert-info" wire:loading wire:target='updateUser'>Updating...</span>
                    <span class="alert-alert-info" wire:loading.remove wire:target='updateUser'>Update
                        Profile</span>

                </button>
                <a href="#" class="dash-cancel-btn tran3s">Cancel</a>
            </div>
        </div>


    </form>
</div>
