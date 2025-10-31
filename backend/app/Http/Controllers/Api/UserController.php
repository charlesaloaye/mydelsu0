<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ReferralReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        // Calculate current profile completion
        $profileComplete = $this->calculateProfileCompletion($user);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'whatsapp' => $user->whatsapp,
                'dob' => $user->dob,
                'matric_num' => $user->matric_num,
                'student_id' => $user->student_id,
                'type' => $user->type,
                'role' => $user->role,
                'user_status' => $user->user_status,
                'referral_code' => $user->referral_code,
                'referral_number' => $user->referral_number,
                'referrer_id' => $user->referrer_id,
                'how_did_you_hear' => $user->how_did_you_hear,
                'social_media' => $user->social_media,
                'is_verified' => $user->is_verified,
                'profile_complete' => $profileComplete,
                'balance' => $user->balance,
                'wallet_balance' => $user->wallet_balance,
                'picture' => $user->picture ? Storage::url($user->picture) : null,
                'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                'verification_status' => $user->verification_status,
                'verification_submitted_at' => $user->verification_submitted_at,
                'student_id_image' => $user->student_id_image ? Storage::url($user->student_id_image) : null,
                'additional_documents' => $user->additional_documents,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'last_login_at' => $user->last_login_at,
                // Settings
                'email_notifications' => $user->email_notifications,
                'push_notifications' => $user->push_notifications,
                'sms_notifications' => $user->sms_notifications,
                'marketing_emails' => $user->marketing_emails,
                'profile_visibility' => $user->profile_visibility,
                'show_email' => $user->show_email,
                'show_phone' => $user->show_phone,
                'show_whatsapp' => $user->show_whatsapp,
                'theme' => $user->theme,
                'auto_theme' => $user->auto_theme,
                'is_active' => $user->is_active,
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'whatsapp' => 'sometimes|nullable|string|max:20',
            'dob' => 'sometimes|nullable|date',
            'matric_num' => 'sometimes|nullable|string|max:50',
            'student_id' => 'sometimes|nullable|string|max:50',
            'type' => 'sometimes|nullable|in:aspirant,student,alumni',
            'user_status' => 'sometimes|nullable|in:aspirant,current_student,alumni',
            'how_did_you_hear' => 'sometimes|nullable|string|max:255',
            'social_media' => 'sometimes|nullable|string|max:255',
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify current password if changing password
        if ($request->has('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }
        }

        $updateData = $request->only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'whatsapp',
            'dob',
            'matric_num',
            'student_id',
            'type',
            'user_status',
            'how_did_you_hear',
            'social_media'
        ]);

        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        // Calculate profile completion
        $profileComplete = $this->calculateProfileCompletion($user, $updateData);
        $updateData['profile_complete'] = $profileComplete;

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => $user->fresh(),
                'profile_complete' => $profileComplete
            ]
        ]);
    }

    /**
     * Upload user avatar
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        // Recalculate profile completion
        $profileComplete = $this->calculateProfileCompletion($user);
        $user->update(['profile_complete' => $profileComplete]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar uploaded successfully',
            'data' => [
                'user' => $user->fresh(),
                'avatar_url' => Storage::url($path),
                'profile_complete' => $profileComplete
            ]
        ]);
    }

    /**
     * Verify user profile
     */
    public function verifyProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'additional_documents' => 'nullable|array',
            'additional_documents.*' => 'file|mimes:jpeg,png,jpg,pdf|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Store verification documents
        $studentIdPath = $request->file('student_id_image')->store('verification', 'public');

        $verificationData = [
            'student_id_image' => $studentIdPath,
            'verification_status' => 'pending',
            'verification_submitted_at' => now()
        ];

        if ($request->has('additional_documents')) {
            $additionalDocs = [];
            foreach ($request->file('additional_documents') as $doc) {
                $additionalDocs[] = $doc->store('verification', 'public');
            }
            $verificationData['additional_documents'] = json_encode($additionalDocs);
        }

        $user->update($verificationData);

        // Recalculate profile completion
        $profileComplete = $this->calculateProfileCompletion($user);
        $user->update(['profile_complete' => $profileComplete]);

        return response()->json([
            'success' => true,
            'message' => 'Verification documents submitted successfully. Your account will be reviewed by our admin team.',
            'data' => [
                'user' => $user->fresh(),
                'profile_complete' => $profileComplete
            ]
        ]);
    }

    /**
     * Get user referrals
     */
    public function referrals(Request $request)
    {
        $user = $request->user();

        $referrals = User::where('referral_number', $user->whatsapp)
            ->select('id', 'first_name', 'last_name', 'email', 'created_at', 'is_verified')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $referrals
        ]);
    }

    /**
     * Get referral statistics
     */
    public function referralStats(Request $request)
    {
        $user = $request->user();

        $totalReferrals = User::where('referral_number', $user->whatsapp)->count();
        $verifiedReferrals = User::where('referral_number', $user->whatsapp)
            ->where('is_verified', true)
            ->count();

        $totalEarnings = ReferralReward::where('user_id', $user->id)
            ->where('is_paid', true)
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'total_referrals' => $totalReferrals,
                'verified_referrals' => $verifiedReferrals,
                'total_earnings' => $totalEarnings,
                'referral_code' => $user->referral_code,
                'referral_link' => url('/register?ref=' . $user->whatsapp)
            ]
        ]);
    }

    /**
     * Generate referral link
     */
    public function generateReferralLink(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'referral_code' => $user->referral_code,
                'referral_link' => url('/register?ref=' . $user->whatsapp),
                'whatsapp_message' => "Join myDelsu using my referral code: {$user->referral_code}. Get access to verified DELSU resources and earn rewards!"
            ]
        ]);
    }

    /**
     * Calculate profile completion percentage
     */
    private function calculateProfileCompletion($user, $updateData = [])
    {
        $user = $user->fresh();
        $user->fill($updateData);

        $fields = [
            'first_name' => 8,
            'last_name' => 8,
            'email' => 8,
            'phone' => 5,
            'whatsapp' => 5,
            'dob' => 5,
            'matric_num' => 10,
            'student_id' => 5,
            'type' => 5,
            'user_status' => 5,
            'how_did_you_hear' => 3,
            'social_media' => 3,
            'avatar' => 10,
            'is_verified' => 15,
            'student_id_image' => 10
        ];

        $completed = 0;
        $total = array_sum($fields);

        foreach ($fields as $field => $weight) {
            if ($field === 'is_verified') {
                if ($user->is_verified) {
                    $completed += $weight;
                }
            } elseif ($field === 'student_id_image') {
                if ($user->student_id_image) {
                    $completed += $weight;
                }
            } else {
                if (!empty($user->$field)) {
                    $completed += $weight;
                }
            }
        }

        return min(100, round(($completed / $total) * 100));
    }

    /**
     * Update notification preferences
     */
    public function updateNotificationPreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_notifications' => 'sometimes|boolean',
            'push_notifications' => 'sometimes|boolean',
            'sms_notifications' => 'sometimes|boolean',
            'marketing_emails' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update($request->only([
            'email_notifications',
            'push_notifications',
            'sms_notifications',
            'marketing_emails'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Notification preferences updated successfully',
            'data' => $user->fresh()
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacySettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_visibility' => 'sometimes|in:public,friends,private',
            'show_email' => 'sometimes|boolean',
            'show_phone' => 'sometimes|boolean',
            'show_whatsapp' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update($request->only([
            'profile_visibility',
            'show_email',
            'show_phone',
            'show_whatsapp'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Privacy settings updated successfully',
            'data' => $user->fresh()
        ]);
    }

    /**
     * Update theme preferences
     */
    public function updateThemeSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'theme' => 'sometimes|in:light,dark,auto',
            'auto_theme' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update($request->only([
            'theme',
            'auto_theme'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Theme preferences updated successfully',
            'data' => $user->fresh()
        ]);
    }

    /**
     * Deactivate user account
     */
    public function deactivateAccount(Request $request)
    {
        $user = $request->user();

        $user->update([
            'is_active' => false,
            'deactivated_at' => now()
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deactivated successfully. You can reactivate by logging in again.'
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Soft delete the user
        $user->delete();

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deletion initiated. You will receive a confirmation email.'
        ]);
    }

    /**
     * Get user uploads
     */
    public function getUserUploads(Request $request)
    {
        $user = $request->user();
        $type = $request->get('type', 'all');

        $uploads = [];

        // For now, return mock data since the upload models don't exist yet
        // This will be updated when the upload system is fully implemented

        if ($type === 'all' || $type === 'hostel') {
            $uploads['hostels'] = [
                [
                    'id' => 1,
                    'title' => 'Sample Hostel 1',
                    'location' => 'Stadium Road, Abraka',
                    'status' => 'approved',
                    'price' => '₦80,000 - ₦120,000',
                    'created_at' => now()->subDays(2)->toISOString(),
                ],
                [
                    'id' => 2,
                    'title' => 'Sample Hostel 2',
                    'location' => 'Main Campus Area',
                    'status' => 'pending',
                    'price' => '₦60,000 - ₦100,000',
                    'created_at' => now()->subDays(1)->toISOString(),
                ]
            ];
        }

        if ($type === 'all' || $type === 'question') {
            $uploads['questions'] = [
                [
                    'id' => 1,
                    'course_code' => 'MTH 401',
                    'title' => 'Real Analysis',
                    'status' => 'approved',
                    'earnings' => 150,
                    'created_at' => now()->subDays(3)->toISOString(),
                ],
                [
                    'id' => 2,
                    'course_code' => 'MTH 402',
                    'title' => 'Complex Analysis',
                    'status' => 'pending',
                    'earnings' => 0,
                    'created_at' => now()->subDays(1)->toISOString(),
                ]
            ];
        }

        if ($type === 'all' || $type === 'project') {
            $uploads['projects'] = [
                [
                    'id' => 1,
                    'title' => 'Final Year Project',
                    'description' => 'A comprehensive study on...',
                    'status' => 'approved',
                    'earnings' => 200,
                    'created_at' => now()->subDays(5)->toISOString(),
                ]
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $uploads
        ]);
    }

    /**
     * Get user subscription status
     */
    public function subscription(Request $request)
    {
        $user = $request->user();

        // For now, assume a simple free plan unless subscription fields are added later
        $subscription = [
            'plan' => 'free',
            'status' => 'active',
            'valid' => true,
            'renews' => false,
            'expires_at' => null,
        ];

        return response()->json([
            'success' => true,
            'data' => $subscription,
        ]);
    }

    /**
     * Get referrer info by code or number
     */
    public function referrerInfo($code)
    {
        // Support both referral_code and whatsapp (used in legacy referral links)
        $referrer = User::where('referral_code', $code)
            ->orWhere('whatsapp', $code)
            ->select('id', 'first_name', 'last_name', 'email', 'whatsapp', 'referral_code', 'is_verified')
            ->first();

        if (!$referrer) {
            return response()->json([
                'success' => false,
                'message' => 'Referrer not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $referrer->id,
                'name' => trim($referrer->first_name . ' ' . $referrer->last_name),
                'email' => $referrer->email,
                'whatsapp' => $referrer->whatsapp,
                'referral_code' => $referrer->referral_code,
                'is_verified' => (bool) $referrer->is_verified,
            ],
        ]);
    }
}
