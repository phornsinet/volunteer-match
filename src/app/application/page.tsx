"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "../../../utils/supabase/client";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient();

    try {
      if (!formData.cv) throw new Error("Please upload your CV")

      // Generate unique file name
      const fileExt = formData.cv.name.split(".").pop()
      const fileName = `${formData.firstName}-${formData.lastName}-${Date.now()}.${fileExt}`

      // 1️⃣ Upload CV to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, formData.cv)

      if (uploadError) throw uploadError

      // 2️⃣ Get public URL of the uploaded CV
      const { data: publicUrlData } = supabase.storage
        .from("cvs")
        .getPublicUrl(fileName)

      const cvUrl = publicUrlData.publicUrl
      console.log("CV Public URL:", cvUrl)

      // 3️⃣ Insert data into Supabase table
      const { error: dbError } = await supabase.from("applications").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          email: formData.email,
          phone_number: formData.phoneNumber,
          why_apply: formData.whyApply,
          why_choose_you: formData.whyChooseYou,
          experience: formData.experience,
          cv_url: cvUrl,
        },
      ])

      if (dbError) {
        console.error("Supabase DB Insert Error:", dbError)
        throw dbError
      }

      alert("✅ Application submitted successfully!")

      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        whyApply: "",
        whyChooseYou: "",
        experience: "",
        cv: null,
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      console.error("Submission error:", errorMessage)
      alert(`❌ Submission failed: ${errorMessage}`)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-red-400 mb-6">Volunteer Application Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="First Name" value={formData.firstName} onChange={(v) => handleInputChange("firstName", v)} />
          <InputField label="Last Name" value={formData.lastName} onChange={(v) => handleInputChange("lastName", v)} />
          <SelectField label="Gender" value={formData.gender} onChange={(v) => handleInputChange("gender", v)} />
          <InputField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v) => handleInputChange("dateOfBirth", v)} />
          <InputField label="Email" type="email" value={formData.email} onChange={(v) => handleInputChange("email", v)} />
          <InputField label="Phone Number" value={formData.phoneNumber} onChange={(v) => handleInputChange("phoneNumber", v)} />
          <TextareaField label="Why you apply this volunteer?" value={formData.whyApply} onChange={(v) => handleInputChange("whyApply", v)} />
          <TextareaField label="Why are you the person we chose?" value={formData.whyChooseYou} onChange={(v) => handleInputChange("whyChooseYou", v)} />
          <TextareaField label="Give me your experience volunteer before?" value={formData.experience} onChange={(v) => handleInputChange("experience", v)} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload your CV <span className="text-red-500">*</span></label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium">
            Submit
          </Button>
        </form>

        <button onClick={handleBack} className="mt-4 text-gray-700 underline">← Back</button>
      </div>
    </div>
  )
}

// ----------------- Reusable Components -----------------
interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full" required />
  </div>
)

interface TextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}
const TextareaField: React.FC<TextareaFieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-24 resize-none" placeholder="Please type your answer here..." required />
  </div>
)

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}
const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Male</SelectItem>
        <SelectItem value="female">Female</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </div>
)
