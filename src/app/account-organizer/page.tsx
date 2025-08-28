"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, useRef, useCallback } from "react"
import { User } from "lucide-react"
import Image from "next/image"
import { createClient } from "../../../utils/supabase/client";
import toast from "react-hot-toast";
import { getAccountDetails, updateAccountDetails, getOrganizerOpportunitiesByUserId, getAllOpportunities, createTestOpportunity, OpportunityData, getAllGeneralApplications, updateGeneralApplicationStatus, GeneralApplicationData, AccountDetailsData } from "@/components/profiles"; // Updated imports

export default function AccountPage() {
  const supabase = createClient();
  console.log("AccountPage (Organizer) component rendering.");
  const [userInfo, setUserInfo] = useState({
    firstName: "Sinet",
    lastName: "Phorn",
    email: "phorn.sinet24@kit.edu.kh",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: null as string | null,
  })

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Events created by the organizer (will be fetched from database)
  const [organizerEvents, setOrganizerEvents] = useState<OpportunityData[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)

  const [applicantStatuses, setApplicantStatuses] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState(false)

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  // Helper function to determine status (you can customize this logic)
  const getEventStatus = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 7) return "New";
    return "Active";
  }

  // Function to refresh events
  const refreshEvents = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log("Refreshing events for user ID:", user.id);
      setIsLoadingEvents(true);
      try {
        // Use user ID instead of email for more reliable querying
        const events = await getOrganizerOpportunitiesByUserId(user.id);
        console.log("Refreshed events:", events);
        setOrganizerEvents(events);
        toast.success("Events refreshed!");
      } catch (error) {
        console.error("Failed to refresh events:", error);
        toast.error("Failed to refresh events");
      } finally {
        setIsLoadingEvents(false);
      }
    }
  }, [supabase])

  // Function to refresh applications
  const refreshApplications = async () => {
    console.log("Refreshing general applications...");
    setIsLoadingApplicants(true);
    try {
      const applications = await getAllGeneralApplications();
      console.log("Refreshed general applications:", applications);
      setGeneralApplicants(applications);
      toast.success("Applications refreshed!");
    } catch (error) {
      console.error("Failed to refresh applications:", error);
      toast.error("Failed to refresh applications");
    } finally {
      setIsLoadingApplicants(false);
    }
  }

  useEffect(() => {
    console.log("AccountPage (Organizer) useEffect triggered.");
    const fetchProfile = async () => {
      console.log("Fetching user session...");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User session data:", user);
      if (user) {
        try {
            console.log("User authenticated. Fetching profile details...");
            const data = await getAccountDetails(user.id);
            console.log("Profile data received:", data);

            if (data) {
              setUserInfo({
                firstName: data.first_name || "",
                lastName: data.last_name || "",
                email: data.email || "",
                phoneNumber: data.phone_number || "",
                password: "", // Passwords are not fetched for security
                confirmPassword: "",
                profileImageUrl: data.avatar_url || null,
              });
              setProfileImage(data.avatar_url || null);
              console.log("Updated userInfo after fetch:", userInfo);

              // Fetch organizer's events using their user ID (more reliable than email)
              console.log("User ID for events query:", user.id);
              
              if (user.id) {
                console.log("Fetching organizer's events using user ID:", user.id);
                setIsLoadingEvents(true);
                try {
                  // Debug: First check what's in the database
                  const allOpportunities = await getAllOpportunities();
                  console.log("All opportunities in database:", allOpportunities);
                  
                  const events = await getOrganizerOpportunitiesByUserId(user.id);
                  console.log("Fetched events for user ID", user.id, ":", events);
                  setOrganizerEvents(events);
                  
                  // Also fetch applications for the organizer
                  await refreshApplications();
                } catch (eventError) {
                  console.error("Failed to fetch events:", eventError);
                  toast.error("Failed to load events data.");
                } finally {
                  setIsLoadingEvents(false);
                }
              } else {
                console.log("No user ID available to fetch events");
                setIsLoadingEvents(false);
              }
            } else {
              console.log("No profile found in database, using auth user data");
              // If no profile found, use auth user data and still try to fetch events
              const authEmail = user.email || "";
              setUserInfo({
                firstName: "",
                lastName: "",
                email: authEmail,
                phoneNumber: "",
                password: "",
                confirmPassword: "",
                profileImageUrl: null,
              });
              setProfileImage(null);
              console.log("Reset userInfo to empty state but using auth email:", authEmail);
              
              // Try to fetch events using auth user ID
              if (user.id) {
                console.log("Fetching organizer's events using auth user ID:", user.id);
                setIsLoadingEvents(true);
                try {
                  // Debug: First check what's in the database
                  const allOpportunities = await getAllOpportunities();
                  console.log("All opportunities in database:", allOpportunities);
                  
                  const events = await getOrganizerOpportunitiesByUserId(user.id);
                  console.log("Fetched events with auth user ID:", events);
                  setOrganizerEvents(events);
                  
                  // Also fetch applications for the organizer
                  await refreshApplications();
                } catch (eventError) {
                  console.error("Failed to fetch events with auth user ID:", eventError);
                  toast.error("Failed to load events data.");
                } finally {
                  setIsLoadingEvents(false);
                }
              } else {
                setIsLoadingEvents(false);
              }
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Failed to load profile data.");
            setIsLoadingEvents(false);
        }
      } else {
        console.log("User not authenticated for profile fetch.");
        setIsLoadingEvents(false);
      }
    };
    fetchProfile();
  }, [supabase, userInfo]);

  // Add effect to refresh when page becomes visible (when navigating back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing events...");
        refreshEvents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userInfo.email, refreshEvents]);

  // General applicants from applications table (real data from database)
  const [generalApplicants, setGeneralApplicants] = useState<GeneralApplicationData[]>([])
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true)
  const [selectedApplicant, setSelectedApplicant] = useState<GeneralApplicationData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      const updates: Partial<AccountDetailsData> = {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving profile:", error.message);
        toast.error(`Failed to save profile: ${error.message}`);
      } else {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile: Unknown error");
      }
    }
  };

  const handleStatusChange = async (applicantId: string, status: string) => {
    try {
      await updateGeneralApplicationStatus(applicantId, status);
      // Update local state
      setGeneralApplicants(prev => 
        prev.map(app => 
          app.id === applicantId ? { ...app, status: status as 'pending' | 'approved' | 'rejected' } : app
        )
      );
      setApplicantStatuses((prev) => ({
        ...prev,
        [applicantId]: status,
      }));
      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error uploading or updating image:", error.message);
        toast.error(`Failed to update profile image: ${error.message}`);
      } else {
        console.error("Error uploading or updating image:", error);
        toast.error("Failed to update profile image: Unknown error");
      }
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
            {/* Right Column - Events Section */}
            <div>
              <div className="space-y-6">
                {/* Events Created by Organizer */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Events</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={refreshEvents}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1"
                      >
                        Refresh
                      </Button>
                      <Button
                        onClick={async () => {
                          console.log("Creating test event...");
                          const { data: { user } } = await supabase.auth.getUser();
                          if (user?.email && user?.id) {
                            try {
                              await createTestOpportunity(user.email, user.id);
                              // Refresh events after creating test event
                              await refreshEvents();
                            } catch (error) {
                              console.error("Failed to create test event:", error);
                              toast.error("Failed to create test event");
                            }
                          }
                        }}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
                      >
                        Create Test Event
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4">
                    <span>Event Title</span>
                    <div className="flex gap-4">
                      <span>Location</span>
                      <span>Date Created</span>
                    </div>
                  </div>
                  <div className="space-y-3 h-[200px] overflow-y-scroll">
                    {isLoadingEvents ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-gray-500">Loading events...</div>
                      </div>
                    ) : organizerEvents.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-full text-center">
                        <div className="text-gray-500 mb-2">No events created yet</div>
                        <div className="text-xs text-gray-400">Click &quot;Create Test Event&quot; to add a sample event</div>
                      </div>
                    ) : (
                      organizerEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-sky-300 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-sky-400 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{event.title}</span>
                            <span className="text-xs text-gray-600">Status: {getEventStatus(event.created_at)}</span>
                            <span className="text-xs text-gray-500">Organizer: {event.organizer_name}</span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium">{event.location}</span>
                            <span>{formatDate(event.created_at)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-center mt-4">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                      See more
                    </Button>
                  </div>
                  
                  {/* Debug Info */}
                  <div className="mt-4 p-3 bg-gray-100 rounded text-xs space-y-1">
                    <div><strong>Debug Info:</strong></div>
                    <div>Current User Email: {userInfo.email}</div>
                    <div>Auth User Email: {userInfo.email}</div>
                    <div>Events Count: {organizerEvents.length}</div>
                    <div>Loading: {isLoadingEvents ? 'Yes' : 'No'}</div>
                    <div>
                      <Button
                        onClick={async () => {
                          const allEvents = await getAllOpportunities();
                          console.log("All events in database:", allEvents);
                          alert(`Total events in database: ${allEvents.length}. Check console for details.`);
                        }}
                        className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 mt-1"
                      >
                        Check All Events in DB
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                    <div className="font-bold text-lg">Total Events</div>
                    <div className="text-2xl font-bold">{organizerEvents.length}</div>
                  </div>
                  <div className="bg-red-400 text-white p-4 rounded-lg text-center">
                    <div className="font-bold text-lg">Total Applicants</div>
                    <div className="text-2xl font-bold">{generalApplicants.length}</div>
                  </div>
                </div>
                {/* Volunteer Applicants List */}
                <div className="bg-red-300 rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Applications</h3>
                  <div className="space-y-3 h-[300px] overflow-y-scroll">
                    {isLoadingApplicants ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading applications...</div>
                      </div>
                    ) : generalApplicants.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">No applications yet</div>
                      </div>
                    ) : (
                      generalApplicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="flex items-center justify-between bg-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {applicant.first_name} {applicant.last_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                Applied: {new Date(applicant.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={applicantStatuses[applicant.id] || applicant.status || "pending"}
                                onValueChange={(value) => handleStatusChange(applicant.id, value)}
                              >
                                <SelectTrigger className="w-24 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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

      {/* Application Details Modal */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">First Name</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedApplicant.first_name}</div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Last Name</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedApplicant.last_name}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">Gender</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedApplicant.gender}</div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Date of Birth</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {new Date(selectedApplicant.date_of_birth).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedApplicant.email}</div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Phone Number</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedApplicant.phone_number}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Why do you want to apply?</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
                  {selectedApplicant.why_apply}
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Why should we choose you?</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
                  {selectedApplicant.why_choose_you}
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Experience</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
                  {selectedApplicant.experience}
                </div>
              </div>

              {selectedApplicant.cv_url && (
                <div>
                  <Label className="text-gray-700 font-medium">CV</Label>
                  <div className="mt-1">
                    <Button
                      onClick={() => selectedApplicant.cv_url && window.open(selectedApplicant.cv_url, '_blank')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      View CV
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-gray-700 font-medium">Application Date</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded border">
                  {new Date(selectedApplicant.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6 pt-4 border-t">
              <Button
                onClick={() => {
                  handleStatusChange(selectedApplicant.id, 'approved');
                  setIsModalOpen(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  handleStatusChange(selectedApplicant.id, 'pending');
                  setIsModalOpen(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2"
              >
                Pending
              </Button>
              <Button
                onClick={() => {
                  handleStatusChange(selectedApplicant.id, 'rejected');
                  setIsModalOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}