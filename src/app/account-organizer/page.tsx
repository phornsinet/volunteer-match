"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '../../../utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface OpportunityData {
  id: string;
  title: string;
  organizer_name: string;
  location: string;
  duration: string;
  email: string;
  requirement: string;
  benefit: string;
  poster_url: string | null;
  created_at: string;
}

export default function AccountPage() {
  // Create supabase client once using useMemo to prevent recreation on every render
  const supabase = useMemo(() => createClient(), []);
  
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: null as string | null,
  })

  // Remove unused state and ref
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  // const imageInputRef = useRef<HTMLInputElement>(null);
  const [organizerEvents, setOrganizerEvents] = useState<OpportunityData[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Helper function to determine status
  const getEventStatus = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 7) return "New"
    if (daysDiff < 30) return "Active"
    return "Ongoing"
  }

  // Function to refresh events with useCallback to prevent dependency issues
  const refreshEvents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoadingEvents(true);
        
        // Fetch organizer events from database
        const { data: events, error } = await supabase
          .from('volunteer_opportunities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setOrganizerEvents(events || []);
      }
    } catch (error) {
      console.error("Failed to refresh events:", error);
      toast.error("Failed to refresh events");
    } finally {
      setIsLoadingEvents(false);
    }
  }, [supabase]);

  // Fetch profile data and events
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch user profile from database
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          setUserInfo({
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            email: user.email || "",
            phoneNumber: profile?.phone_number || "",
            password: "",
            confirmPassword: "",
            profileImageUrl: profile?.profile_image_url || null,
          });

          // Fetch events directly here to avoid dependency issues
          setIsLoadingEvents(true);
          
          const { data: events, error: eventsError } = await supabase
            .from('volunteer_opportunities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (eventsError) {
            console.error("Failed to fetch events:", eventsError);
            toast.error("Failed to load events");
          } else {
            setOrganizerEvents(events || []);
          }
          
          setIsLoadingEvents(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data.");
        setIsLoadingEvents(false);
      }
    };
    
    fetchProfile();
  }, [supabase]);

  // Handle visibility change with useCallback
  const handleVisibilityChange = useCallback(async () => {
    if (!document.hidden) {
      await refreshEvents();
    }
  }, [refreshEvents]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          phone_number: userInfo.phoneNumber,
          profile_image_url: userInfo.profileImageUrl,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={true}
              />
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            
            {isEditing && (
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">My Events</h3>
            
            <div className="space-y-3 h-[200px] overflow-y-scroll">
              {isLoadingEvents ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">Loading events...</div>
                </div>
              ) : organizerEvents.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <div className="text-gray-500 mb-2">No events created yet</div>
                  <div className="text-xs text-gray-400">Create events to see them here</div>
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
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-800"
                onClick={refreshEvents}
              >
                Refresh Events
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}