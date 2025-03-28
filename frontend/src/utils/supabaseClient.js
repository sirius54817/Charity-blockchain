import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Function to log user login attempts
export const logLoginAttempt = async (userId, success, ipAddress = null) => {
  try {
    const userAgent = navigator.userAgent;
    
    await supabase
      .from('login_logs')
      .insert([
        { 
          user_id: userId, 
          user_agent: userAgent,
          ip_address: ipAddress,
          success: success 
        }
      ]);
    
    console.log('Login attempt logged successfully');
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
};

// Function to handle user login
export const loginUser = async (identifier, password, isEmail = false) => {
  try {
    let email = identifier;

    if (!isEmail) {
      // Get email from username
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .ilike('username', identifier)
        .maybeSingle();

      if (error) {
        console.error('Error looking up user:', error);
        return { user: null, error: 'Login failed' };
      }

      if (!data) {
        return { user: null, error: 'User not found' };
      }

      email = data.email;
    }

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { user: null, error: 'Invalid credentials' };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { user: null, error: 'Error fetching user profile' };
    }

    return { user: profile, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Function to register a new user
export const registerUser = async (username, password, fullName, email, role = 'donor') => {
  try {
    // Check if username or email exists
    const { data: existing } = await supabase
      .from('users')
      .select('username, email')
      .or(`username.ilike.${username},email.ilike.${email}`)
      .maybeSingle();

    if (existing) {
      if (existing.username.toLowerCase() === username.toLowerCase()) {
        return { user: null, error: 'Username already taken' };
      }
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        return { user: null, error: 'Email already registered' };
      }
    }

    // Create auth user
    const { data: auth, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          role
        }
      }
    });

    if (authError) throw authError;

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          user_id: auth.user.id,
          username,
          email,
          full_name: fullName,
          role
        }
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: profile, error: null };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null, error: error.message };
  }
};

// Function to get current user data
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { user: null, error: 'No active session' };
    }
    
    // Get user details from our custom users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
      
    if (error) throw error;
    
    return { user: userData, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error.message };
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single();
      
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Function to create a test user
export const createTestUser = async () => {
  try {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!@#',
      username: 'testuser',
      fullName: 'Test User',
      role: 'donor'
    };

    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          username: testUser.username,
          full_name: testUser.fullName
        }
      }
    });

    if (authError) throw authError;

    // Then create profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          user_id: authData.user.id,
          username: testUser.username,
          email: testUser.email,
          full_name: testUser.fullName,
          role: testUser.role
        }
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    console.log('Test user created successfully:', profileData);
    return { success: true, user: profileData };
  } catch (error) {
    console.error('Error creating test user:', error);
    return { success: false, error: error.message };
  }
};

// Function to test user creation and login
export const testUserCreation = async () => {
  try {
    const testUsername = `test_${Math.random().toString(36).substring(2, 10)}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = 'Test@123456';
    
    console.log('Creating test user:', testUsername, testEmail);
    
    // Register test user
    const { user: createdUser, error: createError } = await registerUser(
      testUsername,
      testPassword,
      'Test User',
      testEmail
    );
    
    if (createError) {
      console.error('Error creating test user:', createError);
      return { success: false, error: createError };
    }
    
    console.log('Test user created successfully:', createdUser);
    
    // Try logging in with the test user
    const { user: loggedInUser, error: loginError } = await loginUser(
      testUsername,
      testPassword
    );
    
    if (loginError) {
      console.error('Error logging in with test user:', loginError);
      return { success: false, error: loginError };
    }
    
    console.log('Test user login successful:', loggedInUser);
    
    return { 
      success: true, 
      message: 'Test user created and logged in successfully',
      user: loggedInUser
    };
  } catch (error) {
    console.error('Test user creation/login failed:', error);
    return { success: false, error: error.message };
  }
};

// Function to test direct PostgreSQL connection
export const testDirectPostgresConnection = async () => {
  try {
    // We can't directly connect to PostgreSQL from the browser
    // So we'll use a Supabase function to test the connection
    const { data, error } = await supabase.rpc('test_database_connection');
    
    if (error) {
      console.error('PostgreSQL connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('PostgreSQL connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('PostgreSQL connection test exception:', error);
    return { success: false, error: error.message };
  }
}; 