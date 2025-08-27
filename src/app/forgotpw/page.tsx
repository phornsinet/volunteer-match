"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useAuth } from "@/action/auth"; // Keep useAuth for consistency, though signIn is not used
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Or wherever your password update page is
      });

      if (error) {
        toast.error(error.message);
        setError(error.message);
      } else {
        setMessage("Password reset email sent. Please check your inbox.");
        toast.success("Password reset email sent. Please check your inbox.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md py-16">
          <div className="bg-sky-300 rounded-lg p-8 shadow-lg ">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Forgot Password</h1>
              <p className="text-gray-700">Enter your email to receive a password reset link.</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4" role="alert">
                <span className="block sm:inline">{message}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your registered email address"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-full text-lg mt-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-black">
                  Remember your password?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-red-700 underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
