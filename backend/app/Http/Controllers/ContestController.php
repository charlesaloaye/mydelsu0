<?php

namespace App\Http\Controllers;

use App\Models\ContestParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ContestController extends Controller
{
    public function join($userId)
    {
        $user = User::findOrFail($userId);
        if (!$user->is_verified) {
            return back()->with('error', 'Activate account first.');
        }

        ContestParticipant::create(['user_id' => $user->id, 'status' => 'pending']);
        return back()->with('success', 'Contact admin to confirm contest participation.');
    }

    public function approve($participantId)
    {
        $participant = ContestParticipant::findOrFail($participantId);
        $participant->update(['status' => 'approved']);
        $participant->user->update(['can_refer' => true]);

        return back()->with('success', 'Contest participation approved.');
    }
}
