import users from '../data/users.json';

export const authService = {
  login: (identifier, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.users.find(
          u => (u.email === identifier || u.username === identifier) && u.password === password
        );
        
        if (user) {
          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve({ user: userWithoutPassword, error: null });
        } else {
          resolve({ user: null, error: 'Invalid credentials' });
        }
      }, 500); // Simulate network delay
    });
  },

  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('user');
        resolve({ error: null });
      }, 500);
    });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = users.users.find(
          u => u.email === userData.email || u.username === userData.username
        );

        if (existingUser) {
          resolve({ 
            user: null, 
            error: 'User with this email or username already exists' 
          });
          return;
        }

        const newUser = {
          id: String(users.users.length + 1),
          ...userData
        };

        users.users.push(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        resolve({ user: userWithoutPassword, error: null });
      }, 500);
    });
  }
}; 