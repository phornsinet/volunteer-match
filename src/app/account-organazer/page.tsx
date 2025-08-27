"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { getAccountDetails, updateAccountDetails } from "@/action/profiles"; // Changed from AccountDetails

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState({
    firstName: "Sinet",
    lastName: "Phorn",
    email: "phorn.sinet24@kit.edu.kh",
    password: "",
    confirmPassword: "",
    profileImageUrl: null as string | null,
  })

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [applicantStatuses, setApplicantStatuses] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
            const data = await getAccountDetails(user.id);

            if (data) {
              setUserInfo({
                firstName: data.first_name || "",
                lastName: data.last_name || "",
                email: data.email || "",
                password: "", // Passwords are not fetched for security
                confirmPassword: "",
                profileImageUrl: data.avatar_url || null,
              });
              setProfileImage(data.avatar_url || null);
            } else {
              // If no profile found, reset to initial empty state
              setUserInfo({
                firstName: "",
                lastName: "",
                email: user.email || "", // prefill email from auth user
                phoneNumber: "",
                password: "",
                confirmPassword: "",
                profileImageUrl: null,
              });
              setProfileImage(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Failed to load profile data.");
        }
      }
    };
    fetchProfile();
  }, []);

  const posts = [
    { id: "1", name: "YouLogo", date: "23 Jan, 2025" },
    { id: "2", name: "Graphic Design", date: "23 Jan, 2025" },
    { id: "3", name: "Your Voice", date: "23 Jan, 2025" },
    { id: "4", name: "Web Development", date: "24 Jan, 2025" },
    { id: "5", name: "Mobile App Design", date: "25 Jan, 2025" },
    { id: "6", name: "Data Science Project", date: "26 Jan, 2025" },
  ]

  const applicants = [
    { id: "1", name: "ByeWind", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "Natali Craig", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Drew Cano", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Orlando Diggs", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "5", name: "Andi Lane", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "6", name: "ByeWind", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "7", name: "Natali Craig", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "8", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "9", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "10", name: "Peter Jones", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    // Password validation
    if (isEditing && userInfo.password && userInfo.password !== userInfo.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
    }

    try {
      const updates: any = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
      };

      await updateAccountDetails(user.id, updates);

      // Handle password update if a new password is provided
      if (userInfo.password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: userInfo.password });
        if (passwordError) {
            throw passwordError;
        }
      }

      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(`Failed to save profile: ${error.message}`);
    }
  };

  const handleStatusChange = (applicantId: string, status: string) => {
    setApplicantStatuses((prev) => ({
      ...prev,
      [applicantId]: status,
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated.");
      toast.error("User not authenticated.");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatar').getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      setProfileImage(publicUrl);
      setUserInfo((prev) => ({ ...prev, profileImageUrl: publicUrl }));

      await updateAccountDetails(user.id, { avatar_url: publicUrl });

      toast.success("Profile image updated successfully!");
    } catch (error: any) {
            console.error("Error uploading or updating image:", error);
      toast.error("Failed to update profile image.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Account Details */}
            <div>
              <div className="bg-sky-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 p-0 h-auto font-medium"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                {/* Avatar */}
                <div className="flex justify-center mb-6 relative">
                  <div
                    className="w-20 h-20 bg-black rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {profileImage ? (
                      <Image src={profileImage} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-gray-900 font-medium">First name</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={userInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1 bg-white"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-transparent border-b border-gray-600">{userInfo.firstName}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">Last name</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={userInfo.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1 bg-white"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-transparent border-b border-gray-600">{userInfo.lastName}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1 bg-white"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-transparent border-b border-gray-600 text-blue-700">
                        {userInfo.email}
                      </div>
                    )}
                  </div>
                  
                </div>
                {/* Password Fields */}
                {isEditing && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <Label className="text-gray-900 font-medium">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          value={userInfo.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="mt-1 bg-white"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 font-medium">
                          Confirm New Password
                        </Label>
                        <Input
                          type="password"
                          value={userInfo.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="mt-1 bg-white"
                        />
                      </div>
                    </div>
                )}
                {isEditing && (
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3"
                    >
                      Save your profile
                    </Button>
                )}
              </div>
            </div>
            {/* Right Column - Posts Section */}
            <div>
              <div className="space-y-6">
                {/* Posts List */}
                <div>
                  <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4">
                    <span>Name</span>
                    <span>Date</span>
                  </div>
                  <div className="space-y-3 h-[200px] overflow-y-scroll">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-sky-300 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-sky-400 transition-colors"
                      >
                        <span className="font-medium">{post.name}</span>
                        <span className="text-sm">{post.date}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                      See more
                    </Button>
                  </div>
                </div>
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                    <div className="font-bold text-lg">Visits</div>
                    <div className="text-2xl font-bold">10K</div>
                  </div>
                  <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                    <div className="font-bold text-lg">Apply</div>
                    <div className="text-2xl font-bold">100 person</div>
                  </div>
                </div>
                {/* Applicants List */}
                <div className="bg-red-300 rounded-lg p-4 mt-6">
                  <div className="space-y-3 h-[300px] overflow-y-scroll">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between bg-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">{applicant.name}</span>
                        </div>
                        <Select
                          value={applicantStatuses[applicant.id] || "pending"}
                          onValueChange={(value) => handleStatusChange(applicant.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="pass">Pass</SelectItem>
                            <SelectItem value="fail">Fail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      See more
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}