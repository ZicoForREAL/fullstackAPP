<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'specialization',
        'experience_years',
        'certifications',
        'hourly_rate',
        'availability',
        'rating',
        'total_reviews',
        'level',
        'credits',
        'is_verified',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'certifications' => 'array',
        'availability' => 'array',
        'is_verified' => 'boolean',
        'hourly_rate' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    /**
     * Get the user that owns the coach profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the coach's clients.
     */
    public function clients()
    {
        return $this->belongsToMany(User::class, 'coach_client', 'coach_id', 'client_id')
            ->withTimestamps();
    }

    /**
     * Get the coach's products.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the coach's workout plans.
     */
    public function workoutPlans()
    {
        return $this->hasMany(WorkoutPlan::class);
    }

    /**
     * Get the coach's diet plans.
     */
    public function dietPlans()
    {
        return $this->hasMany(DietPlan::class);
    }
} 