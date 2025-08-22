"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Registration form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-red-400 rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Register</h1>
              <p className="text-gray-700">Please enter your information</p>
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
                  required
                />
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
                  required
                />
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
                  required
                />
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
                  required
                />
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
                  required
                />
              </div>

              <div>
                <Label htmlFor="userRole" className="text-black font-medium">
                  User Role<span className="text-red-600 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange("userRole", value)} required>
                  <SelectTrigger className="mt-2 bg-white border-gray-300 rounded-md h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-full text-lg mt-8"
              >
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
  )
}
