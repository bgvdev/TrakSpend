@component('mail::message')
# Password Reset OTP

You requested a password reset for your {{ config('app.name') }} account. Use the OTP below to reset your password:

@component('mail::panel')
# {{ $otp }}
@endcomponent

This OTP expires in **15 minutes**. If you did not request a password reset, you can safely ignore this email — your password will not be changed.

Thanks,<br>
The {{ config('app.name') }} Team
@endcomponent
