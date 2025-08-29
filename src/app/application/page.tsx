"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ApplicationPage() {
  const router = useRouter();
  // Create supabase client once using useMemo to prevent recreation on every render
  const supabase = useMemo(() => createClient(), []);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Check authentication on page load - Fixed dependency array
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log("User not authenticated, redirecting to login");
        setIsAuthenticated(false);
        alert("Please log in to submit an application");
        router.push("/login");
      } else {
        console.log("User authenticated:", user.email);
        setIsAuthenticated(true);
        if (user.email) {
          setFormData(prev => ({ ...prev, email: user.email! }));
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase]); // Now supabase is stable because of useMemo

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, cv: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Starting form submission...');
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check:', { user: user?.id, authError });
      
      if (authError || !user) {
        throw new Error('Authentication required. Please log in.');
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phoneNumber || !formData.whyApply || !formData.whyChooseYou || 
          !formData.experience) {
        throw new Error('Please fill in all required fields.');
      }

      let cvUrl = null;

      // Handle CV upload if file is selected
      if (formData.cv) {
        console.log('Uploading CV file...');
        const fileExt = formData.cv.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cv-uploads')
          .upload(fileName, formData.cv);

        if (uploadError) {
          console.error('CV upload error:', uploadError);
          throw new Error(`CV upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('cv-uploads')
          .getPublicUrl(fileName);
        
        cvUrl = publicUrl;
        console.log('CV uploaded successfully:', cvUrl);
      }

      // Prepare application data for general_applications table
      const applicationData = {
        user_id: user.id,
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
        status: 'pending'
      };

      console.log('Inserting application data:', applicationData);

      // Insert into general_applications table
      const { data: insertData, error: insertError } = await supabase
        .from('general_applications')
        .insert(applicationData)
        .select();

      console.log('Insert result:', { data: insertData, error: insertError });

      if (insertError) {
        console.error('Supabase DB Insert Error:', insertError);
        throw new Error(`Database error: ${insertError.message || JSON.stringify(insertError)}`);
      }

      console.log('Application inserted successfully:', insertData);
      alert('Application submitted successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        email: user.email || '', // Keep the email pre-filled
        phoneNumber: '',
        whyApply: '',
        whyChooseYou: '',
        experience: '',
        cv: null // Reset CV file properly
      });

    } catch (error: unknown) {
      console.error('Full error details:', error);
      
      if (error instanceof Error) {
        setError(error.message);
        console.error('Submission error:', error.message);
      } else {
        setError('An unexpected error occurred');
        console.error('Unknown error type:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  // Show loading while checking authentication
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show message (though we redirect in useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to submit an application</p>
          <Button onClick={() => router.push("/login")} className="bg-red-400 hover:bg-red-500 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-red-400 mb-6">Volunteer Application Form</h1>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

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

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
