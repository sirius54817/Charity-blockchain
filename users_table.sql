-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_by_username(text);

-- Drop and recreate the users table with proper structure
DROP TABLE IF EXISTS public.users CASCADE;

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('donor', 'charity')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create login_logs table
CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(user_id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    success BOOLEAN NOT NULL,
    ip_address TEXT,
    user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "login_logs_select_policy" ON public.login_logs;
DROP POLICY IF EXISTS "login_logs_insert_policy" ON public.login_logs;

-- Create policies for users table
CREATE POLICY "users_select_policy" ON public.users 
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "users_insert_policy" ON public.users 
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_policy" ON public.users 
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for login_logs table
CREATE POLICY "login_logs_select_policy" ON public.login_logs 
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "login_logs_insert_policy" ON public.login_logs 
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_timestamp ON public.login_logs(timestamp);

-- Create helper function
CREATE OR REPLACE FUNCTION get_user_by_username(username_param TEXT)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    created_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.username, u.email, u.full_name, u.role, u.created_at, u.last_login
    FROM public.users u
    WHERE u.username = username_param;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 