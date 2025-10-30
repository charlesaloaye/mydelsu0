<div>
    <div class="mt-150" id="loginModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen modal-dialog-centered">
            <div class="container">
                <div class="user-data-form modal-content shadow p-5">
                    <div class="text-center">
                        <h2>Hi, Welcome Back!</h2>
                    </div>
                    <div class="form-wrapper m-auto ">
                        <form wire:submit.prevent="login" class="mt-10">
                            <div class="row">
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-25">
                                        <label>Email*</label>
                                        <input wire:model='form.email' type="email"
                                            placeholder="charles@myreceipt.net">
                                    </div>

                                    @error('form.email')
                                        <span class="text-danger">{{ $message }}</span>
                                    @enderror
                                </div>
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-20">
                                        <label>Password*</label>
                                        <input wire:model='form.password' type="password" placeholder="Enter Password"
                                            class="pass_log_id">
                                        <span class="placeholder_icon"><span class="passVicon"><img
                                                    src="images/icon/icon_60.svg" alt=""></span></span>

                                        @error('form.password')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="agreement-checkbox d-flex justify-content-between align-items-center">
                                        <div>
                                            <input type="checkbox" id="remember">
                                            <label for="remember">Remember Me</label>
                                        </div>
                                        {{-- <a href="#">Forget Password?</a> --}}
                                    </div> <!-- /.agreement-checkbox -->
                                </div>
                                <div class="col-12">

                                    <x-button target='login' defaultText='Login' loadingText='Please wait...' />

                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
