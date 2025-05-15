# Kairos Authentication Testing Guide

This document outlines the steps to test the Supabase authentication implementation in the Kairos application.

## Prerequisites

Ensure the following environment variables are set in both your local development environment and on the Netlify dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL="https://mlewlfyzuzffxoifvugk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## Testing the Sign-In Flow

1. **Access the Sign-In Page**
   - Navigate to `https://kairos-ph.netlify.app/signin/`
   - Verify the new UI is displayed with:
     - Blue left panel with Kairos logo and illustration
     - White right panel with sign-in form
     - Orange sign-in button
     - "Forgot password?" link

2. **Test Valid Credentials**
   - Enter a valid email and password for an existing account
   - Click the "Sign In" button
   - Verify you are redirected to the dashboard

3. **Test Invalid Credentials**
   - Enter an incorrect email/password combination
   - Click the "Sign In" button
   - Verify an appropriate error message is displayed

4. **Test Password Reset**
   - Click the "Forgot your password?" link
   - Enter your email address
   - Submit the form
   - Check your email for a password reset link
   - Follow the link and set a new password
   - Verify you can sign in with the new password

## Testing the Sign-Up Flow

1. **Access the Sign-Up Page**
   - Navigate to `https://kairos-ph.netlify.app/signup/`
   - Verify the new UI is displayed with:
     - Blue left panel with Kairos logo and illustration
     - White right panel with sign-up form
     - Orange sign-up button

2. **Test New Account Creation**
   - Enter a valid email and password
   - Click the "Sign Up" button
   - Verify a confirmation message is displayed
   - Check your email for a confirmation link
   - Click the link to confirm your account
   - Verify you can sign in with your new credentials

3. **Test Validation**
   - Try submitting the form with:
     - An empty email field
     - An invalid email format
     - A password shorter than 6 characters
   - Verify appropriate error messages are displayed

## Mobile Responsiveness Testing

1. **Test on Mobile Devices**
   - Access both sign-in and sign-up pages on a mobile device or using browser developer tools
   - Verify the layout switches to a single column
   - Ensure all form elements are properly sized and spaced
   - Test form submission on mobile

## Browser Compatibility

Test the authentication flow on multiple browsers:

- Chrome
- Firefox
- Safari
- Edge

## Troubleshooting

If you encounter issues:

1. **Clear Browser Cache**
   - Chrome/Firefox: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Safari: Hold `Option+Cmd` and click the refresh button

2. **Check Network Requests**
   - Use browser developer tools to inspect network requests
   - Look for any failed API calls to Supabase

3. **Verify Environment Variables**
   - Ensure all required environment variables are correctly set in Netlify

4. **Check Supabase Dashboard**
   - Verify user accounts are being created in the Supabase dashboard
   - Check for any authentication errors in the Supabase logs
