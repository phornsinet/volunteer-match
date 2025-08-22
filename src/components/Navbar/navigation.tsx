"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navi() {
  const pathname = usePathname()

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

              <Link
                href="/about"
                className={
                  pathname === "/about"
                    ? "bg-red-400 text-white px-3 py-2 text-sm font-medium rounded"
                    : "text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                ABOUT
              </Link>

              <Link
                href="/login"
                className={
                  pathname === "/login"
                    ? "bg-red-400 text-white px-3 py-2 text-sm font-medium rounded"
                    : "text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                LOGIN
              </Link>

              <Link
                href="/register"
                className={
                  pathname === "/register"
                    ? "bg-red-400 text-white px-3 py-2 text-sm font-medium rounded"
                    : "text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                }
              >
                REGISTER
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
