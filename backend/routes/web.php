<?php

// use App\Http\Controllers\AirtimeController;
// use App\Http\Controllers\PaystackController;
// use Illuminate\Support\Facades\Route;
// use App\Livewire\{
//     BuyAirtime,
//     PaystackPayment,
//     ActivateUser,
//     BuyData,
//     Dashboard,
//     CgpaCalculator,
//     ComingSoon,
//     FundUser,
//     GuestCgpa,
//     HomePage,
//     Login,
//     Logout,
//     PaymentHistory,
//     Register,
//     ResetPassword,
// };
// use App\Livewire\Admin\{
//     Approval,
//     Dashboard as AdminDashboard,
//     Login as AdminLogin,
//     Logout as AdminLogout,
//     User,
//     Users,
//     Transactions
// };
// use App\Livewire\Auth\ResetPassword as AuthResetPassword;

// use App\Http\Controllers\ContestController;


// /*
// |--------------------------------------------------------------------------
// | Web Routes
// |--------------------------------------------------------------------------
// */


// // Route::get('/test', function () {
// //     return view('test');
// // });

// // Guest Routes
// Route::get('/', Login::class)->name('home');
// Route::get('/reset', AuthResetPassword::class)->name('auth.reset');
// Route::get('/register/{referrer_id?}', Register::class)->name('auth.register');
// Route::get('/login', Login::class)->name('login');
// Route::get('/cgpa', GuestCgpa::class)->name('guest.cgpa');

// // Authenticated User Dashboard
// Route::prefix('dashboard')->middleware('auth')->group(function () {
//     Route::get('/', Dashboard::class)->name('dashboard.index');
//     Route::get('/cgpa', CgpaCalculator::class)->name('cgpa.calculator');
//     Route::get('/logout', Logout::class)->name('auth.logout');
//     Route::get('/activate', ActivateUser::class)->name('dashboard.activate');

//     // Payment Fund Account
//     Route::get('/fund-account', PaystackPayment::class)->name('paystack.init');

//     Route::get('/paystack/init', [PaystackController::class, 'initialize'])->name('paystack.pay');
//     Route::get('/paystack/callback', [PaystackController::class, 'callback'])->name('paystack.callback');

//     // History
//     Route::get('/fund-history', PaymentHistory::class)->name('payment.history');

//     // Buy or Send Airtime
//     Route::get('/buy-airtime', BuyAirtime::class)->name('airtime.buy');
//     // Buy Data
//     Route::get('/buy-data', BuyData::class)->name('data.buy');

//     // Route::post('/airtime/send', [AirtimeController::class, 'send'])->name('airtime.send');
// });

// // Admin Routes
// Route::prefix('admin')->name('admin.')->group(function () {

//     // Admin Login
//     // Route::middleware('guest')->group(function () {
//     Route::get('/login', AdminLogin::class)->name('auth.login');
//     Route::get('/login', AdminLogin::class)->name('login');
//     // });

//     Route::get('/approvals', Approval::class)->name('approvals');

//     Route::post('/contest/approve/{participantId}', [ContestController::class, 'approve'])
//         ->name('contest.approve');

//     // Admin Dashboard (protected)
//     Route::prefix('/')->middleware(['auth', 'admin'])->group(function () {
//         Route::get('/', AdminDashboard::class)->name('dashboard');
//         Route::get('/users', Users::class)->name('users');
//         Route::get('/users/transactions', Transactions::class)->name('users.transactions');
//         Route::get('/user/{id}', User::class)->name('user.show');
//         Route::get('/user/fund/{id}', FundUser::class)->name('user.fund');

//         Route::get('/logout', AdminLogout::class)->name('logout');
//     });
// });


// Route::fallback(ComingSoon::class)->name('fallback');
