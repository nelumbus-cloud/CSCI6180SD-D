const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

/**
 * Auth Service - Handles all authentication-related API calls
 * Uses cookie-based authentication (httponly cookies set by backend)
 */
export const authService = {
  /**
   * Login user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{message: string}>}
   */
  async login(username, password) {
    try {
      // Backend expects OAuth2PasswordRequestForm format (form data)
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${AUTH_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // Important: include cookies
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Incorrect username or password');
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Sign up a new user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @param {string} contact_email - User's email
   * @returns {Promise<{username: string, message: string}>}
   */
  async signup(username, password, contact_email) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({
          username,
          contact_email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Signup failed' }));
        throw new Error(errorData.detail || 'Failed to create account');
      }

      return await response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user details
   * @returns {Promise<{username: string, email: string, uid: number}>}
   */
  async getCurrentUser() {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include', // Important: include cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated
          return null;
        }
        throw new Error('Failed to get user details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Logout user
   * @returns {Promise<{message: string}>}
   */
  async logout() {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Important: include cookies
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<{message: string}>}
   */
  async refreshToken() {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Important: include cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          return null;
        }
        throw new Error('Failed to refresh token');
      }

      return await response.json();
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise<{message: string}>}
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to send reset email' }));
        throw new Error(errorData.detail || 'Failed to send reset email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{message: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to reset password' }));
        throw new Error(errorData.detail || 'Invalid or expired token');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};

