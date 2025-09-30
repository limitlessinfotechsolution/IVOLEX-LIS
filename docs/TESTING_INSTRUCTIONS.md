# Testing Instructions

## How to Verify Authentication is Working

### Step 1: Access the Application

1. Open your browser and go to: http://localhost:5177
2. You should see the main homepage

### Step 2: Test Login Functionality

1. Click on the "Sign In" link in the navigation bar
2. You should be redirected to: http://localhost:5177/login
3. Try logging in with the demo credentials:
   - Email: `demo@ivolex.com`
   - Password: `password`
4. Click "Sign In"
5. You should see a success message and be redirected to the homepage

### Step 3: Test Registration Functionality

1. Click on the "Sign In" link in the navigation bar
2. Click on "Create one" to go to the registration page
3. Fill in the registration form with:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
   - Check "I agree to the Terms of Service and Privacy Policy"
4. Click "Create Account"
5. You should see a success message and be redirected to the homepage

### Step 4: Test Admin Panel Access

1. Log out if you're currently logged in
2. Log in with super admin credentials:
   - Email: `faisal@limitlessinfotech.com`
   - Password: `SuperAdmin2024!`
3. Go to: http://localhost:5177/admin
4. You should see the admin dashboard

### Step 5: Test User Profile Access

1. Make sure you're logged in (with any account)
2. Click on your profile icon or "Profile" link
3. You should see your profile information

## Common Issues and Solutions

### Issue 1: "Login failed" message

**Solution**: 
- Verify you're using the correct demo credentials
- Check the browser console for error messages
- Make sure the development server is running

### Issue 2: Registration fails with "Registration failed" message

**Solution**:
- Ensure all password requirements are met (8 characters, uppercase, lowercase, number)
- Check that you've agreed to the terms of service
- Check the browser console for error messages

### Issue 3: Admin panel shows "Access denied"

**Solution**:
- Make sure you're logged in with super admin credentials
- Try logging out and logging back in with the correct credentials

### Issue 4: Page not found errors

**Solution**:
- Make sure the development server is running (`npm run dev`)
- Check that you're accessing the correct URL (http://localhost:5177)

## Browser Console Checking

To check for errors:

1. Press F12 to open Developer Tools
2. Click on the "Console" tab
3. Look for any red error messages
4. If you see errors, note them down for troubleshooting

## Network Tab Checking

To check API requests:

1. Press F12 to open Developer Tools
2. Click on the "Network" tab
3. Try to log in or register
4. Look for any failed requests (shown in red)
5. Click on failed requests to see details

## Need Help?

If you continue to experience issues:

1. Check all the documentation files created:
   - [AUTHENTICATION_FIX_SUMMARY.md](file:///C:/Users/FAISAL/Downloads/IVOLEX/AUTHENTICATION_FIX_SUMMARY.md)
   - [FIX_AUTHENTICATION_ISSUES.md](file:///C:/Users/FAISAL/Downloads/IVOLEX/FIX_AUTHENTICATION_ISSUES.md)
   - [SUPABASE_SETUP_INSTRUCTIONS.md](file:///C:/Users/FAISAL/Downloads/IVOLEX/SUPABASE_SETUP_INSTRUCTIONS.md)

2. Contact the development team with:
   - Screenshots of the issue
   - Browser console error messages
   - Steps you took to reproduce the issue