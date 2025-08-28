"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, MapPin, Clock, CheckCircle, XCircle, DollarSign, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "../../../utils/supabase/client";
import { getUserApplications, ApplicationData } from "@/components/profiles";

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

  // Application history state
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Rejected' };
      case 'paid':
        return { icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Paid' };
      default:
        return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Pending' };
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setIsLoadingApplications(true);
    try {
      const userApplications = await getUserApplications(user.id);
      setApplications(userApplications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load application history");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  // Filter applications based on status
  const filteredApplications = applications.filter(app => 
    filterStatus === "all" || app.status === filterStatus
  );

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

      // Fetch applications
      await fetchApplications();
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
          {/* Left Column - Account Details */}
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

          {/* Right Column - Application History Dashboard */}
          <div className="space-y-6">
            {/* Application History Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Application History</h3>
                <Button
                  onClick={fetchApplications}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
                >
                  Refresh
                </Button>
              </div>

              {/* Filter Dropdown */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{applications.length}</div>
                  <div className="text-sm text-blue-600">Total Applications</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved' || app.status === 'paid').length}
                  </div>
                  <div className="text-sm text-green-600">Accepted</div>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {isLoadingApplications ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500">Loading applications...</div>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-32 text-center">
                    <div className="text-gray-500 mb-2">
                      {filterStatus === "all" ? "No applications yet" : `No ${filterStatus} applications`}
                    </div>
                    <div className="text-xs text-gray-400">Start applying for volunteer opportunities!</div>
                  </div>
                ) : (
                  filteredApplications.map((application) => {
                    const statusDisplay = getStatusDisplay(application.status);
                    const StatusIcon = statusDisplay.icon;
                    
                    return (
                      <div
                        key={application.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 flex-1">
                            {application.opportunity?.title || "Unknown Opportunity"}
                          </h4>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusDisplay.bg}`}>
                            <StatusIcon className={`w-3 h-3 ${statusDisplay.color}`} />
                            <span className={statusDisplay.color}>{statusDisplay.label}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Organizer: {application.opportunity?.organizer_name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Location: {application.opportunity?.location || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Duration: {application.opportunity?.duration || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Applied: {formatDate(application.applied_at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


