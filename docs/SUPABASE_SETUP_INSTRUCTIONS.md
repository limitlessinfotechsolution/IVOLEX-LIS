# Supabase Setup Instructions

## Issue Identified

The application is not functioning properly because the Supabase configuration in your [.env.local](file:///C:/Users/FAISAL/Downloads/IVOLEX/.env.local) file contains placeholder values. The application is falling back to mock authentication, which is why the login and registration pages appear to not work.

## Solution

To fix the authentication issues, you need to either:

### Option 1: Set up a real Supabase project (Recommended)

1. **Create a Supabase account**
   - Go to https://supabase.com/ and create an account
   - Create a new project

2. **Get your Supabase credentials**
   - In your Supabase project dashboard, go to "Project Settings" → "API"
   - Copy your "Project URL" and "anon public" key

3. **Update your .env.local file**
   - Replace the placeholder values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-actual-project-url
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

4. **Set up the database schema**
   - In your Supabase dashboard, go to the SQL editor
   - Run the SQL schema from [SUPABASE_SCHEMA.sql](file:///C:/Users/FAISAL/Downloads/IVOLEX/SUPABASE_SCHEMA.sql) in your project

### Option 2: Use the built-in demo credentials (Quick test)

If you just want to test the application quickly without setting up Supabase:

1. **Use the demo credentials:**
   - Email: `demo@ivolex.com`
   - Password: `password`

2. **Use the super admin credentials:**
   - Email: `faisal@limitlessinfotech.com`
   - Password: `SuperAdmin2024!`

## Testing the Fix

After updating your configuration:

1. Restart your development server
2. Try logging in with either:
   - Demo credentials (for customer access)
   - Super admin credentials (for admin access)
3. Try registering a new account

## Troubleshooting

If you're still experiencing issues:

1. Check the browser console for any error messages
2. Verify that your .env.local file is in the root directory of your project
3. Make sure you've restarted your development server after making changes
4. Check that there are no syntax errors in your .env.local file

## Need Help?

If you need help setting up Supabase:
1. Refer to the official Supabase documentation: https://supabase.com/docs
2. Check the existing [SUPABASE_INTEGRATION.md](file:///C:/Users/FAISAL/Downloads/IVOLEX/SUPABASE_INTEGRATION.md) file in your project
3. Contact the development team for assistance