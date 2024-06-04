<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Profile extends Model
{
  protected $fillable = ['title', 'description', 'url', 'image','username'];

    public function user()
    {
        return $this->belongsTo(User::class);
    } // Remove the semicolon from here

    public function followers(){
        return $this->belongsToMany(User::class);
    }

    
    use HasFactory;
}