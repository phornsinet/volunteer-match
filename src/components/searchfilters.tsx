'use client'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, MapPin } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function SearchFilters() {
  const [isPersonSelected, setIsPersonSelected] = useState(true)
  const [showCauseDropdown, setShowCauseDropdown] = useState(false)
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  const [selectedCause, setSelectedCause] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("Phnom Penh, Cambodia")

  const causes = [
    { icon: "🐾", label: "Animal" },
    { icon: "🧸", label: "Children" },
    { icon: "🏘️", label: "Community" },
    { icon: "🌱", label: "Environment" },
    { icon: "🌍", label: "International" },
  ]
  const skills = ["Academics", "Arts", "Computer & IT", "HR", "Finance"]

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
  
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex mb-0">
            <div className="flex items-center mr-6 cursor-pointer" onClick={() => setIsPersonSelected(true)}>
              <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${
                  isPersonSelected ? "bg-green-500" : "bg-gray-300"
                }`}>
                {isPersonSelected && <span className="text-white text-sm">✓</span>}
              </div>
              <span className={`font-semibold ${isPersonSelected ? "text-black" : "text-gray-600"}`}>In Person</span>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => setIsPersonSelected(false)}>
              <div
                className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${
                  !isPersonSelected ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {!isPersonSelected && <span className="text-white text-sm">✓</span>}
              </div>
              <span className={`font-semibold ${!isPersonSelected ? "text-black" : "text-gray-600"}`}>Virtual</span>
            </div>
          </div>
          

          <div className="flex-1 min-w-30 relative">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Phnom Penh, Cambodia" 
                className="w-full h-10 pl-10 border border-gray-200 rounded-md bg-gray-100" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Location of the opportunity</p>
          </div>

          <div className="flex-1 min-w-30 relative">
            <Button
              variant="outline"
              className="w-full h-10 justify-between bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                setShowCauseDropdown(!showCauseDropdown)
                setShowSkillDropdown(false)
              }}
            >
              {selectedCause || "Cause"}
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showCauseDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="bg-red-400 text-white px-4 py-2 font-bold">My Cause</div>
                {causes.map((cause) => (
                  <div
                    key={cause.label}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedCause(cause.label)
                      setShowCauseDropdown(false)
                    }}
                  >
                    <span className="mr-3 text-lg">{cause.icon}</span>
                    <span className="font-medium">{cause.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-30 relative">
            <Button
              variant="outline"
              className="w-full h-10 justify-between bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                setShowSkillDropdown(!showSkillDropdown)
                setShowCauseDropdown(false)
              }}
            >
              {selectedSkill || "Skill"}
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showSkillDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="bg-red-400 text-white px-4 py-2 font-bold">Select your skill</div>
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedSkill(skill)
                      setShowSkillDropdown(false)
                    }}
                  >
                    <span className="font-medium border-b border-gray-300 pb-1">{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Input placeholder="Search by keyword..." className="h-10 w-40" />
          <Button className="bg-red-400 hover:bg-red-500 text-white px-6 h-10 w-36">CLEAR ALL FILTERS</Button>
        </div>
      </div>
    </div>
  )
}
