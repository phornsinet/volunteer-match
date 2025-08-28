"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronLeft, ChevronRight, Clock10Icon, HomeIcon, WorkflowIcon } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { createClient } from "../../../utils/supabase/client";
import { AuthProvider, useAuth } from "@/action/auth"
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface Opportunity {
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

function Card1Content() {
  const supabase = createClient();
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const auth = useAuth();
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch opportunities from Supabase
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching opportunities:', error);
          toast.error('Failed to load opportunities');
        } else {
          setOpportunities(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [supabase]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (auth?.session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', auth.session.user.id)
          .single();

        if (profileData?.user_role === 'volunteer') {
          setIsVolunteer(true);
        } else {
          setIsVolunteer(false);
        }
      } else {
        setIsVolunteer(false); // Not logged in, so not a volunteer
      }
    };

    checkUserRole();
  }, [auth, supabase]);

  const scrollLeft = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollBy({
        left: -300, // Adjust this value to control how much to scroll
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollBy({
        left: 300, // Adjust this value to control how much to scroll
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-red-400 py-12">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">THE BEST VOLUNTEER OPPORTUNITIES IN</h2>
          <p className="text-white flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2" />
            Phnom Penh, Cambodia
          </p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div
            ref={cardContainerRef}
            className="flex space-x-6 overflow-x-scroll scrollbar-hide mx-12"
          >
            {loading ? (
              // Loading state
              <div className="min-w-[300px] rounded-lg p-6 text-white">
                <div className="animate-pulse">
                  <div className="w-full h-60 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                </div>
              </div>
            ) : opportunities.length > 0 ? (
              // Display opportunities from database
              opportunities.map((opportunity) => (
                <div key={opportunity.id} className="min-w-[300px] rounded-lg p-6 text-white">
                  <div className="w-full h-60 bg-gray-100 rounded mb-4 overflow-hidden flex items-center justify-center">
                    <Image
                      src={opportunity.poster_url || "/p1.jpeg"}
                      alt={opportunity.title}
                      width={300}
                      height={240}
                      className="w-full h-full object-contain transition-transform duration-200 hover:scale-105"
                      style={{ aspectRatio: '11/17' }} // Standard poster ratio (11" x 17")
                    />
                  </div>
                  <h3 className="font-bold mb-2">{opportunity.title}</h3>
                  <div className="flex items-center text-sm mb-2">
                    <HomeIcon className="w-4 h-4 mr-1" />
                    <span>Organization: {opportunity.organizer_name}</span>
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <WorkflowIcon className="w-4 h-4 mr-1" />
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <Clock10Icon className="w-4 h-4 mr-1" />
                    <span>Posted: {new Date(opportunity.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    className="bg-blue-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105" 
                    disabled={!auth?.session || isVolunteer}
                  >
                    {!auth?.session ? "LOGIN TO APPLY" : isVolunteer ? "APPLIED" : "APPLY"}
                  </Button>
                </div>
              ))
            ) : (
              // No opportunities found
              <div className="min-w-[300px] rounded-lg p-6 text-white text-center">
                <p>No opportunities available yet.</p>
                <p className="text-sm mt-2">Be the first to post one!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
            <div className="w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Card1() {
  return (
    <AuthProvider>
      <Card1Content />
    </AuthProvider>
  )
}
