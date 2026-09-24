<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'google_id', 'avatar', 'is_affiliate', 'is_streamer', 'is_auction', 'is_disabled'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements CanResetPasswordContract
{
    /** @use HasFactory<UserFactory> */
    use CanResetPasswordTrait, HasApiTokens, HasFactory, Notifiable;

    public function getIsDisabledAttribute(mixed $value): bool
    {
        return (bool) $value || ($this->attributes['banned_at'] ?? null) !== null;
    }

    public function getIsAdminAttribute(mixed $value): bool
    {
        if (array_key_exists('is_admin', $this->attributes)) {
            return (bool) $value;
        }

        if (! $this->exists) {
            return false;
        }

        $connection = $this->getConnection();
        if (! $connection->getSchemaBuilder()->hasTable('model_has_roles') ||
            ! $connection->getSchemaBuilder()->hasTable('roles')) {
            return false;
        }

        return $connection->table('model_has_roles as assignments')
            ->join('roles', 'roles.id', '=', 'assignments.role_id')
            ->where('assignments.model_id', $this->getKey())
            ->where('assignments.model_type', $this->getMorphClass())
            ->where('roles.name', 'Super Admin')
            ->where('roles.guard_name', 'web')
            ->exists();
    }

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
            'is_admin' => 'boolean',
            'is_affiliate' => 'boolean',
            'is_streamer' => 'boolean',
            'is_auction' => 'boolean',
            'is_disabled' => 'boolean',
        ];
    }
}
