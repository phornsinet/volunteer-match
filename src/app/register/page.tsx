// components/RegisterPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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
    setLoading(true);

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      const errorMessages = Object.values(newErrors).filter(msg => msg !== '');
      if (errorMessages.length > 0) {
        toast.error(`Please fix the following issues:\n${errorMessages.join('\n')}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
      setLoading(false);
      return;
    }

    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");

      console.log('🔄 Creating user account with trigger...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: formData.phoneNumber,
            user_role: formData.userRole,
            full_name: formData.fullName,
          },
        },
      });

      if (authError) {
        console.error('❌ Auth error:', authError.message);
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      console.log('✅ User account created:', authData.user?.id);
      console.log('✅ Profile created automatically by database trigger');

      toast.success("Registration successful! Please check your email to verify your account.");
      
      // Redirect based on user role
      setTimeout(() => {
        if (formData.userRole === "organization") {
          router.push("/find-organization");
        } else {
          router.push("/find-opportunities");
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Unexpected registration error:', error);
      if (error instanceof Error) {
        toast.error(`An unexpected error occurred: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
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
                  Full Name / Organization Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Enter your full name or organization name"
                  required
                  disabled={loading}
                />
                {errors.fullName && (
                  <p className="text-red-800 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-black font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="This will be used for login and communication"
                  required
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-800 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-black font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Please provide a contact phone number"
                  required
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-800 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-black font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Password must be at least 6 characters long"
                  required
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-red-800 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-black font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="mt-2 bg-white border-gray-300 rounded-md h-12"
                  placeholder="Re-enter your password"
                  required
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-800 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="userRole" className="text-black font-medium">
                  I am a...
                </Label>
                <Select 
                  value={formData.userRole} 
                  onValueChange={(value) => handleInputChange("userRole", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-md h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userRole && (
                  <p className="text-red-800 text-sm mt-1">{errors.userRole}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-medium rounded-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-200">
                  Already have an account?{" "}
                  <a href="/login" className="text-black font-medium hover:underline">
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
