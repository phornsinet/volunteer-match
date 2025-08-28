"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/action/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";

    if (!email) {
      errorMessage = "Please enter your email address.";
      isValid = false;
    } else {
      const emailRegex = /^[^"]+@[^"]+\.[^"]+$/;
      if (!emailRegex.test(email)) {
        errorMessage = "Please enter a valid email address.";
        isValid = false;
      }
    }

    if (!password) {
      if (errorMessage) errorMessage += "\n";
      errorMessage += "Please enter your password.";
      isValid = false;
    }

    setError(errorMessage);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (!auth?.signIn) {
      toast.error("Authentication service not available.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await auth.signIn(email, password);

      if (error) {
        toast.error(error.message);
        setError(error.message);
      } else if (data?.user) {
        toast.success("Login successful! Redirecting to homepage...");
        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginInProgress = isLoading || auth?.loading;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md py-16">
          <div className="bg-sky-300 rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Login</h1>
              <p className="text-gray-700">Please enter your information</p>
            </div>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please enter your email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <div className="text-right mt-2">
                  <Link
                    href="/forgotpw"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forget Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-full text-lg mt-8"
                disabled={loginInProgress}
              >
                {loginInProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-black">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-red-600 hover:text-blue-400 underline"
                  >
                    Sign up
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
