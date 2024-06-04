<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;


class PostController extends Controller
{

   

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'caption'=>'required|string|max:255',
            'image'=>'required|image|mimes:jpg,png,gif,webp|max:2048',
        ]);
        if ($validator->fails()){
            return response()->json(['errors'=>$validator->errors()],422);
        }
        
        $imagePath= $request->file('image')->store('uploads', 'public');
        
        
        $data = $validator->validated();
        auth()->user()->posts()->create([
        'caption'=>$data['caption'],
        'image'=>$imagePath,
        ]);

        

        return redirect('/');
    }

    public function show(\App\Models\Posts $post){
        // $post->load('user.profile');
        $post['likes_count'] = $post->likes->count();
        $post['has_liked'] = $post->likes->contains('user_id', auth()->id());
        $post->user['follows']=(auth()->check() && auth()->user()->following->contains($post->user->id) ? true : false);

        
        return Inertia::render(
            'Post', ['post' => $post,'profile'=>$post->user->profile]);
}

    public function destroy(\App\Models\Posts $post)
    {
        // Ensure the authenticated user is the owner of the post
        if (auth()->user()->id !== $post->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete the post
        $post->delete();



        return response()->json(['message' => 'Post deleted successfully'], 201);
    }


    
    }
