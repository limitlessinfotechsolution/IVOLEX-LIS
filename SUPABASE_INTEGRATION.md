# Supabase Integration Guide

## Overview
This document explains how to set up and configure Supabase for the IVOLEX e-commerce platform. Supabase provides backend services including authentication, database, and real-time capabilities.

## Prerequisites
1. A Supabase account (free tier available at https://supabase.com)
2. A Supabase project created
3. Supabase project URL and anon key

## Setup Instructions

### 1. Create a Supabase Project
1. Go to https://supabase.com and sign up or log in
2. Create a new project
3. Note down your Project URL and anon key from the project settings

### 2. Configure Environment Variables
Update your `.env.local` file with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Schema
Run the SQL schema from `SUPABASE_SCHEMA.sql` in your Supabase SQL editor:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
4. Run the SQL script

### 4. Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email signup
3. Configure any additional authentication providers you want to support

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: TEXT (Unique)
- `first_name`: TEXT
- `last_name`: TEXT
- `role`: TEXT (Default: 'customer')
- `avatar_url`: TEXT
- `is_admin`: BOOLEAN (Default: FALSE)
- `is_super_admin`: BOOLEAN (Default: FALSE)

### Products Table
- `id`: UUID (Primary Key)
- `name`: TEXT
- `description`: TEXT
- `price`: DECIMAL
- `category`: TEXT
- `segment`: TEXT
- `image_url`: TEXT
- `gallery`: TEXT[]
- `rating`: DECIMAL
- `reviews_count`: INTEGER
- `in_stock`: BOOLEAN
- `stock_count`: INTEGER
- `tags`: TEXT[]
- `specifications`: JSONB

### Orders Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `total_amount`: DECIMAL
- `status`: TEXT
- `shipping_address`: JSONB
- `billing_address`: JSONB
- `payment_method`: TEXT

### Audit Logs Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users)
- `action`: TEXT
- `table_name`: TEXT
- `record_id`: UUID
- `old_values`: JSONB
- `new_values`: JSONB
- `ip_address`: TEXT
- `user_agent`: TEXT

## Admin Roles
The system supports multiple admin roles:
- `super_admin`: Full access to all features
- `admin`: Access to products, orders, and users
- `support`: Access to orders and users
- `content_manager`: Access to products only

## Security Policies
Row Level Security (RLS) is enabled on all tables with the following policies:
- Users can only view and update their own data
- Admins have broader access based on their role
- Audit logs are only accessible to admins

## Testing the Integration
1. Start the development server: `npm run dev`
2. Navigate to the admin login page: `/admin/login`
3. Use the default admin credentials:
   - Email: `faisal@limitlessinfotech.com`
   - Password: `SuperAdmin2024!`
4. You should be redirected to the admin dashboard

## Troubleshooting
1. **Environment variables not loading**: Ensure you've updated `.env.local` and restarted the development server
2. **Database connection errors**: Verify your Supabase URL and anon key are correct
3. **Authentication issues**: Check that email signup is enabled in Supabase authentication settings
4. **Permission errors**: Ensure RLS policies are correctly applied

## Next Steps
1. Customize the admin roles and permissions based on your team's needs
2. Add additional tables for specific business requirements
3. Implement real-time features using Supabase's real-time capabilities
4. Set up storage for product images and other assets