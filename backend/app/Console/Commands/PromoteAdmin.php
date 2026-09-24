<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteAdmin extends Command
{
    protected $signature = 'admin:promote {email}';

    protected $description = 'Grant administrator access to an existing account';

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();
        if (! $user) {
            $this->error('No account has that email. Register first.');

            return self::FAILURE;
        } $user->forceFill(['is_admin' => true])->save();
        $this->info('Administrator access granted. Sign in again to refresh your profile.');

        return self::SUCCESS;
    }
}
