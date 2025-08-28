"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { createClient } from "../../../utils/supabase/client";

export default function PostingPage() {
  const supabaseClient = createClient(); // Use the same client as account-organizer page
  const [formData, setFormData] = useState({
    title: "",
    organizerName: "",
    location: "",
    duration: "",
    email: "",
    requirement: "",
    benefit: "",
    poster: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        console.log("Auth check - User:", user);
        console.log("Auth check - Error:", error);
        
        if (user) {
          setIsAuthenticated(true);
          console.log("User is authenticated:", user.email);
        } else {
          setIsAuthenticated(false);
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">You must be logged in to create an opportunity.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, poster: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get current user with detailed logging
    console.log("Attempting to get user for event creation...");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log("User data:", user);
    console.log("User error:", userError);
    
    if (!user) {
      console.error("No user found, user must be logged in");
      alert("You must be logged in to create an opportunity. Please log in and try again.");
      setIsSubmitting(false);
      return;
    }

    console.log("User authenticated, proceeding with event creation...");
    console.log("User ID:", user.id);
    console.log("User Email:", user.email);

    let posterUrl = null

    // 1. Upload poster if present
    if (formData.poster) {
      console.log("Uploading poster...");
      const fileExt = formData.poster.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data, error } = await supabaseClient.storage
        .from("posters") // Make sure you have a "posters" bucket in Supabase Storage
        .upload(fileName, formData.poster)

      if (error) {
        console.error("Poster upload error:", error);
        alert("Poster upload failed: " + error.message)
        setIsSubmitting(false)
        return
      }
      posterUrl = supabaseClient.storage.from("posters").getPublicUrl(fileName).data.publicUrl
      console.log("Poster uploaded successfully:", posterUrl);
    }

    // 2. Insert opportunity data with user_id
    console.log("Inserting opportunity data...");
    const opportunityData = {
      title: formData.title,
      organizer_name: formData.organizerName,
      location: formData.location,
      duration: formData.duration,
      email: formData.email,
      requirement: formData.requirement,
      benefit: formData.benefit,
      poster_url: posterUrl,
      user_id: user.id, // Add user_id to track who created the opportunity
    };
    
    console.log("Opportunity data to insert:", opportunityData);
    
    const { error: insertError } = await supabaseClient.from("opportunities").insert([opportunityData])

    setIsSubmitting(false)

    if (insertError) {
      console.error("Insert error:", insertError);
      alert("Failed to post opportunity: " + insertError.message)
    } else {
      console.log("Opportunity posted successfully!");
      alert("Opportunity posted successfully!")
      // Optionally reset form
      setFormData({
        title: "",
        organizerName: "",
        location: "",
        duration: "",
        email: "",
        requirement: "",
        benefit: "",
        poster: null,
      })
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header Section */}
      <div className="bg-white py-8">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <div className="bg-blue-400 text-white px-8 py-4 rounded-lg">
            <h1 className="text-2xl font-bold">Posting</h1>
          </div>
          <button
            onClick={handleBack}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            ← BACK
          </button>
        </div>
      </div>

      {/* Main Content - Single Column Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-blue-400 p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Title<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-2 h-12 rounded-md"
                required
              />
            </div>

            {/* Organizer Name Field */}
            <div>
              <Label htmlFor="organizerName" className="text-gray-700 font-medium">
                Organizer Name<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="organizerName"
                type="text"
                value={formData.organizerName}
                onChange={(e) => handleInputChange("organizerName", e.target.value)}
                className="mt-2 h-12 rounded-md"
                required
              />
            </div>

            {/* Locations Dropdown */}
            <div>
              <Label htmlFor="location" className="text-gray-700 font-medium">
                Locations<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange("location", value)} required>
                <SelectTrigger className="mt-2 h-12 rounded-md">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phnom-penh">Phnom Penh, Cambodia</SelectItem>
                  <SelectItem value="siem-reap">Siem Reap, Cambodia</SelectItem>
                  <SelectItem value="battambang">Battambang, Cambodia</SelectItem>
                  <SelectItem value="sihanoukville">Sihanoukville, Cambodia</SelectItem>
                  <SelectItem value="kampot">Kampot, Cambodia</SelectItem>
                  <SelectItem value="remote">Remote/Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration Field */}
            <div>
              <Label htmlFor="duration" className="text-gray-700 font-medium">
                Duration<span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 3 months, 2 days/week"
                className="mt-2 min-h-24 rounded-md resize-none"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-2 h-12 rounded-md"
                required
              />
            </div>

            {/* Requirement Field */}
            <div>
              <Label htmlFor="requirement" className="text-gray-700 font-medium">
                Requirement<span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="requirement"
                value={formData.requirement}
                onChange={(e) => handleInputChange("requirement", e.target.value)}
                placeholder="List the requirements for volunteers..."
                className="mt-2 min-h-32 rounded-md resize-none"
                required
              />
            </div>

            {/* Benefit Field */}
            <div>
              <Label htmlFor="benefit" className="text-gray-700 font-medium">
                Benefit<span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="benefit"
                value={formData.benefit}
                onChange={(e) => handleInputChange("benefit", e.target.value)}
                placeholder="Describe the benefits volunteers will receive..."
                className="mt-2 min-h-32 rounded-md resize-none"
                required
              />
            </div>

            {/* Upload Poster Field */}
            <div>
              <Label htmlFor="poster" className="text-gray-700 font-medium">
                Upload Poster<span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="mt-2">
                <input
                  id="poster"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="w-full p-3 border border-gray-300 rounded-md bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>

            {/* POST Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "POSTING..." : "POST"}
              </Button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}