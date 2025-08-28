"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/action/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function Navigation() {
  const supabase = createClient();
  const { session, loading, signOut } = useAuth() ?? {};
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function getUserRole() {
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role:", profileError);
          setUserRole(null);
        } else if (profileData) {
          setUserRole(profileData.user_role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    }

    getUserRole();
  }, [session, supabase]);

  if (loading) {
    return null;
  }

  const accountLink = userRole === 'volunteer' 
    ? '/account-volunteer' 
    : userRole === 'organization' 
    ? '/account-organizer' 
    : '/login';

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
  };

  const renderOpportunitiesLink = () => {
    if (userRole === 'organization') {
      return (
        <Link href="/post">
          <Button
            className={
              pathname === "/post"
                ? "bg-red-400 hover:bg-red-500 text-white px-6"
                : "bg-white hover:bg-gray-300 text-gray-700 px-6"
            }
          >
            POST OPPORTUNITY
          </Button>
        </Link>
      );
    } else {
      return (
        <Link href="/find-opportunities">
          <Button
            className={
              pathname === "/find-opportunities"
                ? "bg-red-400 hover:bg-red-500 text-white px-6"
                : "bg-white hover:bg-gray-300 text-gray-700 px-6"
            }
          >
            FIND OPPORTUNITIES
          </Button>
        </Link>
      );
    }
  };

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Volunteer World Logo" width={100} height={40} />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <Button
                  variant="default"
                  className={
                    pathname === "/"
                      ? "bg-red-400 hover:bg-red-500 text-white px-6"
                      : "bg-white hover:bg-gray-300 text-gray-700 px-6"
                  }
                >
                  HOME
                </Button>
              </Link>

              {renderOpportunitiesLink()}

              <Link href="/about">
                <Button
                  className={
                    pathname === "/about"
                      ? "bg-red-400 hover:bg-red-500 text-white px-6"
                      : "bg-white hover:bg-gray-300 text-gray-700 px-6"
                  }
                >
                  ABOUT
                </Button>
              </Link>

              {/* Conditional rendering for authenticated vs. unauthenticated users */}
              {!session ? (
                <>
                  <Link href="/login">
                    <Button
                      className={
                        pathname === "/login"
                          ? "bg-red-400 hover:bg-red-500 text-white px-6"
                          : "bg-white hover:bg-gray-300 text-gray-700 px-6"
                      }
                    >
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className={
                        pathname === "/register"
                          ? "bg-red-400 hover:bg-red-500 text-white px-6"
                          : "bg-white hover:bg-gray-300 text-gray-700 px-6"
                      }
                    >
                      REGISTER
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={accountLink}>
                    <Button
                      className={
                        (pathname === "/account-volunteer" || pathname === "/account-organizer")
                          ? "bg-red-400 hover:bg-red-500 text-white px-6"
                          : "bg-white hover:bg-gray-300 text-gray-700 px-6"
                      }
                    >
                      ACCOUNT
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    className="bg-white hover:bg-gray-300 text-gray-700 px-6"
                  >
                    LOGOUT
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
