<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Profile;




class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

    $profile = $user->profile;
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile'=> $profile,

        ]);
    }

    public function search(Request $request)
     {
        $query = $request->input('query');

        // Validate the search query
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        // Search for users by name or email
        $users = User::where('name', 'LIKE', "%{$query}%")
                     ->orWhere('email', 'LIKE', "%{$query}%")->with('profile')->get();



        return response()->json($users);
    }



    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());


        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }


        $request->user()->save();


        try {

        $user = auth()->user();

        $profile = $user->profile ?: new \App\Models\Profile();

        
        $validator = Validator::make($request->all(),[
            'username' => 'string|max:255|nullable',
            'title' => 'string|max:255|nullable',
            'description' => 'string|max:255|nullable',
            'url' => 'string|max:255|nullable',
            // 'image'=>'image|mimes:jpg,png,gif:2048',
            'image'=>'',
        ]);
        if ($validator->fails()){
            return response()->json(['errors'=>$validator->errors()],422);
        }

        $data = $validator->validated();
        
      if ($request->hasFile('image')) {
    $imagePath = $request->file('image')->store('profile', 'public');
    $data = array_merge($data, ['image' => $imagePath]);
}

// Debugging: Check if $data contains the image path

// Fill the profile with validated profile data from the request
$profile->fill($data);

// Debugging: Check if $profile contains the image path after filling

// Associate the profile with the user
$user->profile()->save($profile);

} catch (\Exception $e) {
    dd($e->getMessage()); // Display the error message
}

        return Redirect('/profile/'. $user->id);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
