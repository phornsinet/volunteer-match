// components/RegisterPage.tsx

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

export default function RegisterPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for the field being changed
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      userRole: "",
    };
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = "Please enter your full name or organization name.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Please enter your phone number.";
      isValid = false;
    } else {
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number should only contain digits.";
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = "Please enter a password.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!formData.userRole) {
      newErrors.userRole = "Please select a user role.";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      const errorMessages = Object.values(newErrors).filter(msg => msg !== '');
      if (errorMessages.length > 0) {
        toast.error(`Please fix the following issues:\n${errorMessages.join('\n')}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
      return;
    }

    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: formData.phoneNumber,
            user_role: formData.userRole,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registration successful! Redirecting...");
        if (formData.userRole === "organization") {
          router.push("/find-organization");
        } else {
          router.push("/find-opportunities");
        }
      }
    } catch (error) {
      console.error('Supabase registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-red-400 rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Register</h1>
              <p className="text-gray-200">Please enter your information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-black font-medium">
                  Full Name/ Organization<span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Enter your full name or organization name"
                  required
                />
                {errors.fullName && <p className="text-white text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-black font-medium">
                  Email<span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="This will be used for login and communication"
                  required
                />
                {errors.email && <p className="text-white text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-black font-medium">
                  Phone Number<span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Please provide a contact phone number"
                  required
                />
                {errors.phoneNumber && <p className="text-white text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-black font-medium">
                  Password<span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Password must be at least 6 characters long"
                  required
                />
                {errors.password && <p className="text-white text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-black font-medium">
                  Confirm Password<span className="text-red-600 ml-1">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Please enter the same password as above"
                  required
                />
                {errors.confirmPassword && <p className="text-white text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <Label htmlFor="userRole" className="text-black font-medium">
                  User Role<span className="text-red-600 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange("userRole", value)} required>
                  <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-md h-12">
                    <SelectValue placeholder="Select your role (Volunteer or Organization)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userRole && <p className="text-white text-xs mt-1">{errors.userRole}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-full text-lg mt-8">
                Register
              </Button>

              <div className="text-center mt-6">
                <p className="text-black">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-red-700 underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
