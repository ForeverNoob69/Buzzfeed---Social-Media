<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function posts(){
        return $this->hasMany(Posts::class)->orderBy('created_at','DESC');
    }

    public function following(){
        return $this->belongsToMany(Profile::class);
    }

    public function profile(){
        return $this->hasOne(Profile::class);
    }

    public function liked()
    {
        return $this->hasMany(Like::class);
    }

    //  protected static function boot()
    // {
    //     parent::boot();

    //     static::created(function ($user) {

    //         // Create a profile for the newly created user
    //         $user->profile()->create([
    //             // Add any default profile attributes here
    //             'username'=>$user->name,
    //             'bio' => 'Welcome to my profile!',
    //             // Add more default attributes as needed
    //         ]);
    //     });
    // }
}
