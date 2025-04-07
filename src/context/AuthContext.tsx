
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
          console.log("Auth state changed:", event, session);
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
    console.log("Setting user from session:", session.user);
    
    try {
      // Get user profile data if it exists
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
      }
      
      const user: User = {
        id,
        email: email || '',
        name: profileData?.name || email?.split('@')[0] || '',
        createdAt: new Date(created_at)
      };
      
      console.log("User set:", user);
      setUser(user);
    } catch (error) {
      console.error("Error in setUserFromSession:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Special handling for email confirmation error
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before logging in. Check your inbox for a verification link.");
          
          // Optionally resend confirmation email
          await supabase.auth.resend({
            type: 'signup',
            email,
          });
          
          toast.info("A new confirmation email has been sent to your inbox.");
          throw new Error("Email not confirmed. Please check your inbox.");
        } else {
          throw error;
        }
      }
      
      console.log("Login successful:", data);
      toast.success("Logged in successfully!");
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Create the auth user with auto-confirmation disabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // Don't auto-confirm email - this relies on Supabase settings
          emailRedirectTo: window.location.origin + '/login',
        },
      });

      if (error) throw error;
      
      console.log("Signup successful:", data);
      
      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        toast.success("Account created! Please check your email to confirm your account before logging in.");
      } else {
        toast.success("Account created successfully!");
      }
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Sign up failed. Please try again.");
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
