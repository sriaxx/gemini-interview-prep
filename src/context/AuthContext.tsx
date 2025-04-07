
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from "sonner";
import api from '@/lib/api';

// Create a context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token by fetching user data
          const response = await api.get('/auth/me');
          const userData = response.data;
          
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            createdAt: new Date(userData.createdAt)
          });
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name || email.split('@')[0],
        createdAt: new Date(userData.createdAt)
      });
      
      toast.success("Logged in successfully!");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Special handling for email confirmation error
      if (error.response?.data?.needsConfirmation) {
        toast.error("Please confirm your email before logging in. Check your inbox for a verification link.");
        throw new Error("Email not confirmed. Please check your inbox.");
      } else {
        const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/signup', {
        email,
        password,
        name,
      });
      
      console.log("Signup successful:", response.data);
      
      toast.success("Account created! Please check your email to confirm your account before logging in.");
      
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.error || "Sign up failed. Please try again.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout endpoint (optional)
      await api.post('/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Clear user state
      setUser(null);
      toast.success("Logged out successfully!");
      
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
