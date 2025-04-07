
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from "sonner";
import supabase from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Create a context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await setUserFromSession(session);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            await setUserFromSession(session);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      setLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const setUserFromSession = async (session: Session) => {
    if (!session.user) return;

    const { id, email, created_at } = session.user;
    
    // Get user profile data if it exists
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', id)
      .single();
    
    const user: User = {
      id,
      email: email || '',
      name: profileData?.name || email?.split('@')[0] || '',
      createdAt: new Date(created_at)
    };
    
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
      
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Create a profile entry for the user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, name, email },
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast.success("Account created successfully! Please check your email for verification.");
      
    } catch (error: any) {
      toast.error(error.message || "Sign up failed. Please try again.");
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success("Logged out successfully!");
      
    } catch (error: any) {
      toast.error(error.message || "Logout failed. Please try again.");
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
