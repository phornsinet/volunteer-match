"use client"
import { AuthProvider, useAuth } from "@/action/auth"
import { HeroSection2 } from "@/components/Hero-Section/hero-section2"
import { SearchFilters } from "@/components/searchfilters"
import Card1 from "@/components/Card-Section/card1"
import Wus from "@/components/wus"
import { TrustSection } from "@/components/trust" 
import FeedBackOrga from "@/components/Reflection/v2"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase.js";

function FindOpportunitiesPage2Content() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      if (auth?.session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', auth.session.user.id)
          .single();

        if (profileData?.user_role === 'volunteer') {
          router.push('/'); // Redirect volunteers to home page
        }
      }
    };

    checkUserRole();
  }, [auth, router]);

    return (
    <div className="min-h-screen bg-white">
      <HeroSection2/>
      <SearchFilters />
      <Card1 />
      <Wus />
      <FeedBackOrga/>
      <TrustSection />
    </div>
  )
}

export default function FindOpportunitiesPage2() {
  return (
    <AuthProvider>
      <FindOpportunitiesPage2Content />
    </AuthProvider>
  )
}
