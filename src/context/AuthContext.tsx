
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from "sonner";

// Create a context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth data in localStorage until we connect to Supabase
const AUTH_STORAGE_KEY = 'interview_prep_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Mock authentication functions (to be replaced with Supabase)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock login - in real app, this would be a Supabase call
      // Simulating server delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - any email/password combination will work
      // This should be replaced with actual authentication
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email: email,
        name: email.split('@')[0],
        createdAt: new Date(),
      };
      
      // Save to localStorage for persistence
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Logged in successfully!");
      
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Mock signup - in real app, this would be a Supabase call
      // Simulating server delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - create a mock user
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        email: email,
        name: name,
        createdAt: new Date(),
      };
      
      // Save to localStorage for persistence
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Account created successfully!");
      
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Mock logout - in real app, this would be a Supabase call
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      toast.success("Logged out successfully!");
      
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
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
