<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Like;


class LikeController extends Controller
{
     public function like(Request $request, $postId)
    {
        $user = $request->user();


        $like = Like::firstOrCreate([
            'user_id' => $user->id,
            'posts_id' => $postId,
        ]);




        return response()->json(['status' => 'true', 'like' => $like], 201);
    }

    public function unlike(Request $request, $postId)
    {
        $user = $request->user();

        $like = Like::where('user_id', $user->id)->where('posts_id', $postId)->first();

        if ($like) {
            $like->delete();
            return response()->json(['status' => 'false'], 200);
        }

        return response()->json(['status' => 'not_found'], 404);
    }
}
