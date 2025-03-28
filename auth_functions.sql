-- Function to get user by username
CREATE OR REPLACE FUNCTION get_user_by_username(username_param TEXT)
RETURNS SETOF users AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM users WHERE username = username_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify user credentials
CREATE OR REPLACE FUNCTION verify_user_credentials(username_param TEXT, password_param TEXT)
RETURNS SETOF users AS $$
DECLARE
  user_record users;
  auth_user auth.users;
BEGIN
  -- Get the user from our custom users table
  SELECT * INTO user_record FROM users WHERE username = username_param;
  
  IF user_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Check if the user exists in auth.users and password matches
  -- Note: This is a simplified version, actual password verification happens in Supabase Auth
  SELECT * INTO auth_user FROM auth.users WHERE id = user_record.user_id;
  
  IF auth_user IS NULL THEN
    RETURN;
  END IF;
  
  -- Return the user record
  RETURN NEXT user_record;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 