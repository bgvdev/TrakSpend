@component('mail::message')
# Welcome to {{ config('app.name') }}, {{ $user->name }}!

Thanks for signing up. You can now start tracking your expenses, organising them by category, and viewing spending insights.

@component('mail::button', ['url' => env('FRONTEND_URL', 'http://localhost:3000')])
Go to {{ config('app.name') }}
@endcomponent

If you didn't create an account, you can safely ignore this email.

Thanks,<br>
The {{ config('app.name') }} Team
@endcomponent
