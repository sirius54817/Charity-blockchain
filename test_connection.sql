-- Function to test database connection
CREATE OR REPLACE FUNCTION test_database_connection()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'connected', true,
    'timestamp', now(),
    'database', current_database(),
    'user', current_user
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 