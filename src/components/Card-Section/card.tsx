import { Button } from "@/components/ui/button"
import { MapPin, ChevronLeft, ChevronRight, Clock10Icon, HomeIcon, WorkflowIcon } from "lucide-react"

export default function card() {
  return (
    <section className="bg-blue-400 py-12">
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-12">

              <div className=" rounded-lg p-6 text-white ">
                <img
                  src="p1.jpeg"
                  alt="Volunteers outdoors"
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
            
                <Button className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </div>

             <div className=" rounded-lg p-6 text-white">
                <img
                  src="p2.webp"
                  alt="Volunteers outdoors"
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
                <Button className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </div>

              <div className=" rounded-lg p-6 text-white">
                <img
                  src="p3.jpg"
                  alt="Volunteers outdoors"
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
                <Button className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </div>

              <div className=" rounded-lg p-6 text-white">
                <img
                  src="p4.webp"
                  alt="Volunteers outdoors"
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
                <Button className="bg-red-400 text-white px-2 py-1 rounded text-sm font-bold mb-4 inline-block transition-transform duration-200 hover:scale-105">
                  APPLY
                </Button>
              </div>
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
