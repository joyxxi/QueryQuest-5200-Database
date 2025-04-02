const API_BASE_URL = "http://localhost:8000/api"; // Adjust to your Django server URL

interface User {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse {
    status: 'success' | 'error';
    message?: string;
    user_id?: number;
    role?: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'; // Make optional with ?
    errors?: any;
    token?: string;
    username?: string;
    email?: string;
  }

export const signup = async (userData: User): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role.toLowerCase()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Signup failed',
        errors: data.errors || data
      };
    }

    return {
      status: 'success',
      ...data
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      status: 'error',
      message: 'Network error during signup'
    };
  }
};

export const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Login failed',
        errors: data.errors || data
      };
    }

    return {
      status: 'success',
      ...data
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 'error',
      message: 'Network error during login'
    };
  }
};

export const getCurrentUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {  // Changed from get_user to login
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to fetch user data'
      };
    }

    return {
      status: 'success',
      ...data
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Network error while fetching user data'
    };
  }
};

  // Add this to your existing userAPI.ts
export const updateUser = async (
    currentEmail: string,
    currentPassword: string,
    updates: {
      username: string;
      email: string;
      password?: string;
    }
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_email: currentEmail,
          current_password: currentPassword,
          new_username: updates.username,
          new_email: updates.email,
          new_password: updates.password
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Update failed'
        };
      }
  
      return {
        status: 'success',
        ...data
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Network error during update'
      };
    }
  };