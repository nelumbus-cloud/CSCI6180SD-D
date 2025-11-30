import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated by calling /me endpoint
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error checking auth:", err);
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} username
   * @param {string} password
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      await authService.login(username, password);
      // After successful login, fetch user details
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        return { success: true };
      } else {
        throw new Error("Failed to get user details after login");
      }
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user - clears both server-side cookies and client-side state
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call logout endpoint to clear server-side cookies
      await authService.logout();

      // Immediately clear client-side user state
      setUser(null);

      // Verify the logout was successful by checking auth status
      // This ensures the cookie was actually deleted
      await checkAuth();

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Logout failed";
      setError(errorMessage);
      // Even if logout fails, clear client-side state
      setUser(null);
      // Still try to verify auth status
      await checkAuth();
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  /**
   * Signup new user
   * @param {string} username
   * @param {string} password
   * @param {string} contact_email
   */
  const signup = async (username, password, contact_email) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signup(username, password, contact_email);
      // After successful signup, fetch user details
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        return { success: true };
      } else {
        throw new Error("Failed to get user details after signup");
      }
    } catch (err) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  
  /**
   * Refresh authentication token
   */
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      if (result) {
        // Token refreshed, verify user is still authenticated
        await checkAuth();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

