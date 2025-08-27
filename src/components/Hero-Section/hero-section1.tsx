'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/action/auth";


export function HeroSection1({
  backgroundImageUrl = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/hero1.jpg')`,
  headingText = "Volunteer World is a platform where individuals and organizations come together to create impact. Whether you&apos;re looking to offer your time, skills, or energy, or you need passionate volunteers for your cause — this is the place for you.",
}) {
  const auth = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (auth?.session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', auth.session.user.id)
          .single();

        setUserRole(profileData?.user_role);
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [auth]);

  const renderButton = () => {
    if (userRole === 'volunteer') {
      return (
        <Link href="/find-opportunities" passHref>
          <Button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105">
            FIND OPPORTUNITY
          </Button>
        </Link>
      );
    } else if (userRole === 'organization') {
      return (
        <Link href="/post" passHref>
          <Button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105">
            POST OPPORTUNITY
          </Button>
        </Link>
      );
    } else {
      return (
        <Link href="/register" passHref>
          <Button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105">
            GET STARTED
          </Button>
        </Link>
      );
    }
  };

  return (
    <div
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: backgroundImageUrl,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            {headingText}
          </h1>
          <div className="flex justify-center space-x-4">
            {renderButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

