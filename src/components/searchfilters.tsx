'use client'
import { Button } from "@/components/ui/button"
import { ChevronDown, MapPin } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface SearchFiltersProps {
  onFiltersChange?: (filters: {
    inPerson: boolean;
    location: string;
    cause: string;
    skill: string;
    keyword: string;
  }) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [isPersonSelected, setIsPersonSelected] = useState(true)
  const [showCauseDropdown, setShowCauseDropdown] = useState(false)
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  const [selectedCause, setSelectedCause] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [location, setLocation] = useState("")
  const [keyword, setKeyword] = useState("")

  const causes = [
    { icon: "🐾", label: "Animal" },
    { icon: "🧸", label: "Children" },
    { icon: "🏘️", label: "Community" },
    { icon: "🌱", label: "Environment" },
    { icon: "🌍", label: "International" },
    { icon: "🎓", label: "Education" },
    { icon: "🏥", label: "Health" },
  ]
  
  const skills = [
    "Academics", 
    "Arts", 
    "Computer & IT", 
    "HR", 
    "Finance",
    "Teaching",
    "Event Planning",
    "Healthcare",
    "Marketing",
    "Writing",
    "Photography"
  ]

  // Function to emit filter changes to parent
  const updateFilters = () => {
    const filters = {
      inPerson: isPersonSelected,
      location: location.trim(),
      cause: selectedCause,
      skill: selectedSkill,
      keyword: keyword.trim()
    };
    
    console.log('🔍 Sending filters:', filters);
    
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setTimeout(updateFilters, 100); // Small delay for better UX
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(selectedSkill === skill ? "" : skill);
    setShowSkillDropdown(false);
    setTimeout(updateFilters, 100);
  };

  const handleCauseSelect = (cause: string) => {
    setSelectedCause(selectedCause === cause ? "" : cause);
    setShowCauseDropdown(false);
    setTimeout(updateFilters, 100);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setTimeout(updateFilters, 100);
  };

  const clearAllFilters = () => {
    setLocation("");
    setSelectedCause("");
    setSelectedSkill("");
    setKeyword("");
    setIsPersonSelected(true);
    setShowCauseDropdown(false);
    setShowSkillDropdown(false);
    
    setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange({
          inPerson: true,
          location: "",
          cause: "",
          skill: "",
          keyword: ""
        });
      }
    }, 100);
  };

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
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full h-10 pl-10 border border-gray-200 rounded-md bg-gray-100" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Type to filter by location</p>
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
                <div className="bg-red-400 text-white px-4 py-2 font-bold">Select Cause</div>
                {causes.map((cause) => (
                  <div
                    key={cause.label}
                    className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      selectedCause === cause.label ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleCauseSelect(cause.label)}
                  >
                    <span className="mr-3 text-lg">{cause.icon}</span>
                    <span className="font-medium">{cause.label}</span>
                    {selectedCause === cause.label && <span className="ml-auto text-blue-500">✓</span>}
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
              {selectedSkill || "Filter by Skill"}
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showSkillDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="bg-red-400 text-white px-4 py-2 font-bold">Select Skill</div>
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      selectedSkill === skill ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSkillSelect(skill)}
                  >
                    <span className="font-medium">{skill}</span>
                    {selectedSkill === skill && <span className="ml-auto text-blue-500">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Input 
            placeholder="Search by keyword..." 
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="h-10 w-40" 
          />
          <Button 
            onClick={clearAllFilters}
            className="bg-red-400 hover:bg-red-500 text-white px-6 h-10 w-36"
          >
            CLEAR ALL FILTERS
          </Button>
        </div>

        {/* Active Filters Display */}
        {(location || selectedSkill || selectedCause || keyword) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            {location && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                📍 {location}
              </span>
            )}
            {selectedSkill && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                🛠️ {selectedSkill}
              </span>
            )}
            {selectedCause && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                🎯 {selectedCause}
              </span>
            )}
            {keyword && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                🔍 {keyword}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}