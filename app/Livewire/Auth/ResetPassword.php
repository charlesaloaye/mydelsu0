<?php

namespace App\Livewire\Auth;

use App\Models\User;
use Livewire\Component;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;

#[Layout('components.HomeLayout')]
class ResetPassword extends Component
{
    public $step = 1;
    public $email;
    public $code;
    public $generatedCode;
    public $newPassword;
    public $confirmPassword;

    public function sendVerificationCode()
    {
        $this->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // generate random 6-digit code
        $this->generatedCode = rand(100000, 999999);

        // store code in session (or DB)
        session(['reset_code_' . $this->email => $this->generatedCode]);

        // send email (basic mail, you can improve with Mailable)
        Mail::raw("Your password reset code is: {$this->generatedCode}", function ($message) {
            $message->to($this->email)->subject('Password Reset Code');
        });

        $this->step = 2;
    }

    public function verifyCode()
    {
        $this->validate([
            'code' => 'required|digits:6',
        ]);

        $storedCode = session('reset_code_' . $this->email);

        if ($storedCode && $this->code == $storedCode) {
            $this->step = 3;
        } else {
            $this->addError('code', 'Invalid or expired verification code.');
        }
    }

    public function resetPassword()
    {
        $this->validate([
            'newPassword' => 'required|min:8',
            'confirmPassword' => 'required|same:newPassword',
        ]);

        $user = User::where('email', $this->email)->first();
        $user->password = Hash::make($this->newPassword);
        $user->save();

        // clear session code
        session()->forget('reset_code_' . $this->email);

        return redirect()->route('login')->with('success', 'Password reset successful, please log in.');

        $this->step = 4;
    }

    public function render()
    {
        return view('livewire.auth.reset-password')->title('Reset Password');
    }
}
