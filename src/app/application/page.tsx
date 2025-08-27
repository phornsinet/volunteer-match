"use client"

import type React from "react"
import Image from "next/image";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    whyApply: "",
    whyChooseYou: "",
    experience: "",
    cv: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, cv: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-400 text-white px-8 py-4 rounded-lg">
              <h1 className="text-2xl font-bold">Information Detail</h1>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            ← BACK
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-red-400 text-xl font-semibold mb-6">Volunteer Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why you apply this volunteer? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.whyApply}
                  onChange={(e) => handleInputChange("whyApply", e.target.value)}
                  placeholder="Please type your address here..."
                  className="w-full h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you the person we chose? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.whyChooseYou}
                  onChange={(e) => handleInputChange("whyChooseYou", e.target.value)}
                  placeholder="Please type your address here..."
                  className="w-full h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-.jsx-700 mb-2">
                  Give me your experience volunteer before? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Please type your address here..."
                  className="w-full h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload your CV <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
              >
                Submit
              </Button>
            </form>
          </div>

          <div className="bg-blue-300 p-8 rounded-lg">
            <div className="bg-blue-400 text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4">YOU LOGO Volunteer for you</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">🏢 Organizer:</span>
                  <span>YOU LOGO</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📍 Location:</span>
                  <span>Phnom Penh, Cambodia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">👨‍💼 Occupation:</span>
                  <span>Graphic Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📅 Start:</span>
                  <span>1 Jan, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">⏰ Duration:</span>
                  <span>3 months, 3days/Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📧 Email:</span>
                  <span>youlogo@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📞 Phone numbers:</span>
                  <span>+855 777 888</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Requirement</h4>
              <div className="bg-blue-400 p-4 rounded-lg text-white">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Must be in design Field</li>
                  <li>18 years up</li>
                  <li>Open Mind</li>
                  <li>Good Communication</li>
                  <li>Can speak English</li>
                </ol>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Benefit</h4>
              <div className="bg-blue-400 p-4 rounded-lg text-white">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Certification</li>
                  <li>Trip to KomPot three days</li>
                  <li>Networking</li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-500 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">VOLUNTEER NEEDED</h4>
                <div className="bg-white text-blue-500 px-3 py-1 rounded-full text-xs font-medium">YOUR LOGO</div>
              </div>

              <div className="flex items-center gap-4">
                <Image src="/smiling-volunteer-blue-shirt.png" alt="Volunteer" width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
