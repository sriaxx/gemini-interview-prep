import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import api from "@/lib/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg("");
    setShowEmailConfirmation(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setShowEmailConfirmation(false);
    
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message?.includes("Email not confirmed")) {
        setShowEmailConfirmation(true);
      } else {
        setErrorMsg(error.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setErrorMsg("Please enter your email address to resend confirmation");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/auth/resend-confirmation', { email: formData.email });
      toast.success(response.data.message || "Confirmation email has been resent. Please check your inbox.");
    } catch (error: any) {
      console.error("Error resending confirmation:", error);
      setErrorMsg(error.response?.data?.error || "Failed to resend confirmation email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              {showEmailConfirmation && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md">
                  <p className="font-medium">Email not confirmed</p>
                  <p className="text-sm mt-1">Please check your inbox for a verification link before logging in.</p>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleResendConfirmation}
                    disabled={loading}
                  >
                    Resend confirmation email
                  </Button>
                </div>
              )}
              
              {errorMsg && !showEmailConfirmation && (
                <div className="text-red-500 text-sm py-2">
                  {errorMsg}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>For demo purposes, use the account you created during signup</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
