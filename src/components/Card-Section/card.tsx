"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronLeft, ChevronRight, Clock10Icon, HomeIcon, WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import Image from "next/image";
import { useAuth } from "@/action/auth";
import toast, { Toaster } from "react-hot-toast";

export default function Card() {
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const { session } = useAuth() ?? {};

  const handleApplyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!session) {
        e.preventDefault();
        toast.error("Please login before applying");
    }
  };

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
    <section className="bg-blue-400 py-12">
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

          {/* This is the new scrollable container */}
          <div
            ref={cardContainerRef}
            className="flex space-x-6 overflow-x-scroll scrollbar-hide mx-12"
          >
            {/* Card 1 */}
            <div className="min-w-[300px] rounded-lg p-6 text-white">
              <Image
                src="/p1.jpeg"
                alt="Volunteers outdoors"
                width={300}
                height={240}
                className="w-full h-60 object-cover rounded mb-4 transition-transform duration-200 hover:scale-105"
              />
              <h3 className="font-bold mb-2">YOU LOGO Volunteer for your cause</h3>
              <div className="flex items-center text-sm mb-2">
                <HomeIcon className="w-4 h-4 mr-1" />
                <span>Organization: YOUGO</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <WorkflowIcon className="w-4 h-4 mr-1" />
                <span>Graphic Design| 3h/Week</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Clock10Icon className="w-4 h-4 mr-1" />
                <span>Deadline:12 Dec, 2025 </span>
              </div>
              <Link href="/application">
                <Button onClick={handleApplyClick} className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="min-w-[300px] rounded-lg p-6 text-white">
              <Image
                src="/p2.webp"
                alt="Volunteers outdoors"
                width={300}
                height={240}
                className="w-full h-60 object-cover rounded mb-4 transition-transform duration-200 hover:scale-105"
              />
              <h3 className="font-bold mb-2">YOU LOGO Volunteer for your cause</h3>
              <div className="flex items-center text-sm mb-2">
                <HomeIcon className="w-4 h-4 mr-1" />
                <span>Organization: YOUGO</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <WorkflowIcon className="w-4 h-4 mr-1" />
                <span>Graphic Design| 3h/Week</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Clock10Icon className="w-4 h-4 mr-1" />
                <span>Deadline:12 Dec, 2025 </span>
              </div>
              <Link href="/application">
                <Button onClick={handleApplyClick} className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="min-w-[300px] rounded-lg p-6 text-white">
              <Image
                src="/p3.jpg"
                alt="Volunteers outdoors"
                width={300}
                height={240}
                className="w-full h-60 object-cover rounded mb-4 transition-transform duration-200 hover:scale-105"
              />
              <h3 className="font-bold mb-2">YOU LOGO Volunteer for your cause</h3>
              <div className="flex items-center text-sm mb-2">
                <HomeIcon className="w-4 h-4 mr-1" />
                <span>Organization: YOUGO</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <WorkflowIcon className="w-4 h-4 mr-1" />
                <span>Graphic Design| 3h/Week</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Clock10Icon className="w-4 h-4 mr-1" />
                <span>Deadline:12 Dec, 2025 </span>
              </div>
              <Link href="/application">
                <Button onClick={handleApplyClick} className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </Link>
            </div>

            {/* Card 4 */}
            <div className="min-w-[300px] rounded-lg p-6 text-white">
              <Image
                src="/p4.webp"
                alt="Volunteers outdoors"
                width={300}
                height={240}
                className="w-full h-60 object-cover rounded mb-4 transition-transform duration-200 hover:scale-105"
              />
              <h3 className="font-bold mb-2">YOU LOGO Volunteer for your cause</h3>
              <div className="flex items-center text-sm mb-2">
                <HomeIcon className="w-4 h-4 mr-1" />
                <span>Organization: YOUGO</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <WorkflowIcon className="w-4 h-4 mr-1" />
                <span>Graphic Design| 3h/Week</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Clock10Icon className="w-4 h-4 mr-1" />
                <span>Deadline:12 Dec, 2025 </span>
              </div>
              <Link href="/application">
                <Button onClick={handleApplyClick} className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}