"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast";

export default function AccountPage1() {
  const [userInfo, setUserInfo] = useState({
    firstName: "Sinet",
    lastName: "Phorn",
    email: "phorn.sinet24@kit.edu.kh",
    password: "",
    confirmPassword: "",
    profileImageUrl: null as string | null, // New field for profile image URL
  })

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('account_id, first_name, last_name, email, avatar_url')
            .eq('account_id', user.id);

          if (error) {
            console.error("Error fetching profile:", error.message || JSON.stringify(error));
            toast.error("Failed to fetch profile data.");
          } else if (data && data.length > 0) {
            const profileData = data[0];
            setUserInfo({
              firstName: profileData.first_name || "",
              lastName: profileData.last_name || "",
              email: profileData.email || "",
              password: "", // Passwords are not fetched for security
              confirmPassword: "",
              profileImageUrl: profileData.avatar_url || null,
            });
            setProfileImage(profileData.avatar_url || null);
          } else {
            // If no profile found, reset to initial empty state
            setUserInfo({
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
              profileImageUrl: null,
            });
            setProfileImage(null);
          }
        }
      };
      fetchProfile();
    }, []);

  const applications = [
    { id: "1", name: "YouLogo", date: "23 Jan, 2025", result: "False" },
    { id: "2", name: "Graphic Design", date: "23 Jan, 2025", result: "Pending" },
    { id: "3", name: "Your Voice", date: "23 Jan, 2025", result: "Pass" },
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
      console.error("User not authenticated.");
      return;
    }

    try {
      const updates = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
      };

            const { error } = await supabase.from('profiles').upsert({ ...updates, account_id: user.id }, { onConflict: 'account_id' });

      if (error) throw error;

      console.log("Profile upserted:", userInfo);
      setIsEditing(false); // Exit editing mode after saving
      toast.success("Profile saved successfully!"); // Add success toast
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(`Failed to save profile: ${error.message}`); // Add error toast
    }
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated.");
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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('account_id', user.id);

      if (updateError) {
        toast.error(updateError.message);
        throw updateError;
      }

      console.log("Profile image updated successfully!");
    } catch (error: any) {
      console.error("Error uploading or updating image:", error);

  const getResultStyle = (result: string) => {
    switch (result) {
      case "Pass":
        return "text-green-600 font-semibold"
      case "False":
        return "text-red-600 font-semibold"
      case "Pending":
        return "text-gray-800 font-semibold"
      default:
        return "text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Account Details */}
            <div>
              <div className="bg-sky-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                  {!isEditing ? (
                    <Button variant="ghost" className="text-red-500 hover:text-red-600 p-0 h-auto font-medium" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="ghost" className="text-green-500 hover:text-green-600 p-0 h-auto font-medium" onClick={handleSaveProfile}>
                        Save
                      </Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-600 p-0 h-auto font-medium" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-20 h-20 bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                {/* User Information */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-gray-900 font-medium">First name</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={userInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1 p-2 bg-white border border-gray-300 rounded"
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
                        className="mt-1 p-2 bg-white border border-gray-300 rounded"
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
                        className="mt-1 p-2 bg-white border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-transparent border-b border-gray-600 text-blue-700">
                        {userInfo.email}
                      </div>
                    )}
                  </div>
                  
                </div>
                {/* Password Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-gray-900 font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      value={userInfo.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 font-medium">
                      Confirm Passwords <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      value={userInfo.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3"
                >
                  Save your profile
                </Button>
              </div>
            </div>
            <div>
              <div className="bg-sky-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Applications record</h2>
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-semibold text-gray-700">
                  <div>Name</div>
                  <div>Date</div>
                  <div>Result</div>
                </div>
                {/* Applications List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {applications.map((application, index) => (
                    <div key={application.id} className="bg-sky-400 rounded-lg p-4 grid grid-cols-3 gap-4 items-center">
                      <div className="font-medium text-gray-900">
                        {index + 1}. {application.name}
                      </div>
                      <div className="text-sm text-gray-800">{application.date}</div>
                      <div className={getResultStyle(application.result)}>{application.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}