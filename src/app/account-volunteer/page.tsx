"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "../../../utils/supabase/client";

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profileImageUrl: null as string | null,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on load
  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get profile row
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        toast.error(`Failed to fetch profile: ${error.message}`);
        return;
      }

      if (profile) {
        setUserInfo({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          phoneNumber: profile.phone_number || "",
          profileImageUrl: profile.avatar_url || null,
        });
        setProfileImage(profile.avatar_url || null);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log("Authenticated User ID:", user.id);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id, // MUST match auth.uid()
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            email: userInfo.email,
            phone_number: userInfo.phoneNumber,
            avatar_url: userInfo.profileImageUrl || null,
          },
          { onConflict: "id" } // insert or update by id
        );

      if (error) {
        console.error("Supabase Upsert Error:", error);
        throw error;
      }

      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Submission error:", err.message);
      toast.error(`Failed to save profile: ${err.message}`);
    }
  };

  // Handle avatar upload
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      setProfileImage(publicUrl);
      setUserInfo(prev => ({ ...prev, profileImageUrl: publicUrl }));
      toast.success("Profile image updated!");
    } catch (error: any) {
      toast.error(`Failed to update profile image: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-sky-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
              {!isEditing ? (
                <Button variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="ghost" onClick={handleSaveProfile}>Save</Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => isEditing && imageInputRef.current?.click()}
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

            {/* User Info */}
            <div className="space-y-4 mb-6">
              <div>
                <Label>First Name</Label>
                <Input type="text" value={userInfo.firstName} disabled={!isEditing} onChange={(e) => handleInputChange("firstName", e.target.value)} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input type="text" value={userInfo.lastName} disabled={!isEditing} onChange={(e) => handleInputChange("lastName", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={userInfo.email} disabled={!isEditing} onChange={(e) => handleInputChange("email", e.target.value)} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="text" value={userInfo.phoneNumber} disabled={!isEditing} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} />
              </div>
            </div>

            {isEditing && (
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full py-3" onClick={handleSaveProfile}>
                Save Profile
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


