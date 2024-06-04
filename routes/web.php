<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FollowsController;
use App\Http\Controllers\LikeController;
use Illuminate\Support\Facades\Cache;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Profile;
use App\Models\Posts;
use App\Models\Like;



Route::get('/', function () {
    $user = auth()->user();
    $user->load('profile');
    $user->load('following');


    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'user'=>$user,
    ]);
})->middleware('auth')->name('home');


Route::get('/profile/{user}', function ($userId) {
    // $user = User::findOrFail($userId); // Assuming you have a User model

      $user = Cache::remember("user_{$userId}", 30, function() use ($userId) {
            return User::with(['profile', 'posts', 'following'])->findOrFail($userId);
        });

    $user['follows']=(auth()->check() && auth()->user()->following->contains($userId) ? true : false);
    return Inertia::render('Dashboard', [
        'user' => $user,
        'followers'=>$user->profile->followers,

    ]);
})->name('profile.user');



Route::middleware('auth')->group(function () {
    Route::get('/p/{post}', [PostController::class,'show'])->name('posts.show');

    Route::post('/p', [PostController::class, 'store'])->name('p.store');

    Route::get('/p/create', function () {
    return Inertia::render('CreatePosts');
})->name('CreatePosts.create');

    Route::delete('/p/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
});



Route::post('/follow/{user}', [FollowsController::class, 'store'])->name('follow.store')->middleware('auth');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// --------------------------------- FOR DATA ONLY---------------------------
Route::get('/posts', function () {

    $user = auth()->user()->id;

    $followingUsers = auth()->user()->following()->pluck('profiles.user_id')->push($user);

    $posts = Posts::whereIn('user_id',$followingUsers)->with(['user.profile', 'likes'])->withCount('likes')->latest()->get();

    $posts->each(function ($post) use ($user) {
        $post->has_liked = $post->likes->contains('user_id', $user);
    });
     return response()->json(["allPosts"=>$posts]);
})->middleware(['auth', 'verified'])->name('posts');

Route::get('/suggested', function () {

    $followingUserIds = auth()->user()->following()->pluck('profile_id');

    $suggestedUsers = Profile::whereNotIn('user_id', $followingUserIds)
    ->where('user_id', '!=', auth()->id())->with('user')->inRandomOrder()
        ->take(10)
        ->get();

     return response()->json(["suggestedUsers"=>$suggestedUsers]);

})->middleware(['auth', 'verified'])->name('suggested');

Route::get('/search-users', [ProfileController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts/{post}/like', [LikeController::class, 'like']);
    Route::post('/posts/{post}/unlike', [LikeController::class, 'unlike']);
});

require __DIR__.'/auth.php';
