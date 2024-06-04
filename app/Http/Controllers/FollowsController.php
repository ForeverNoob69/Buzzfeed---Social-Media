<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FollowsController extends Controller
{
    public function store(\App\Models\User $user){
        // return auth()->user()->following()->toggle($user->profile);

         $profile = $user->profile;

        $authUser = auth()->user();

        // Toggle the follow status
        $followed = $authUser->following()->toggle($profile);

        // Check if the user is now following or unfollowing
        $isFollowing = $followed['attached']; // True if following, False if unfollowing

        // Return a JSON response indicating the follow status
        return response()->json(['followed' => $isFollowing]);
    }

    
}
