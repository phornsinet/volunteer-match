"use client"

import { AuthProvider } from "@/action/auth"
import { HeroSection1} from "@/components/Hero-Section/hero-section1"
import { SearchFilters } from "@/components/searchfilters"
import Card from "@/components/Card-Section/card"
import Wus from "@/components/wus"
import FeedBack from "@/components/Reflection/v1"
import { TrustSection } from "@/components/trust" 
import { useState, useEffect } from "react"
import { createClient } from "../../../utils/supabase/client"

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

interface Filters {
  inPerson: boolean;
  location: string;
  cause: string;
  skill: string;
  keyword: string;
}

export default function FindOpportunitiesPage() {
  const supabase = createClient()
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch opportunities on component mount
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        console.log('🔄 Loading opportunities...')
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        console.log('✅ Loaded opportunities:', data?.length || 0)
        setAllOpportunities(data || [])
        setFilteredOpportunities(data || [])
      } catch (error) {
        console.error('❌ Error loading opportunities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [supabase])

  // Handle filter changes
  const handleFiltersChange = (filters: Filters) => {
    console.log('🔍 Applying filters:', filters)
    
    let filtered = [...allOpportunities]

    // Filter by location
    if (filters.location.trim()) {
      const locationSearch = filters.location.toLowerCase()
      filtered = filtered.filter(opp => 
        opp.location?.toLowerCase().includes(locationSearch)
      )
      console.log(`📍 Location "${filters.location}" → ${filtered.length} results`)
    }

    // Filter by skill (search in requirement field)
    if (filters.skill) {
      const skillSearch = filters.skill.toLowerCase()
      filtered = filtered.filter(opp => 
        opp.requirement?.toLowerCase().includes(skillSearch) ||
        opp.title?.toLowerCase().includes(skillSearch) ||
        opp.benefit?.toLowerCase().includes(skillSearch)
      )
      console.log(`🛠️ Skill "${filters.skill}" → ${filtered.length} results`)
    }

    // Filter by cause (if you have a cause field in your database)
    if (filters.cause) {
      // You might need to add a 'cause' field to your database
      // For now, searching in title and requirement
      const causeSearch = filters.cause.toLowerCase()
      filtered = filtered.filter(opp => 
        opp.title?.toLowerCase().includes(causeSearch) ||
        opp.requirement?.toLowerCase().includes(causeSearch)
      )
      console.log(`🎯 Cause "${filters.cause}" → ${filtered.length} results`)
    }

    // Filter by keyword
    if (filters.keyword.trim()) {
      const keywordSearch = filters.keyword.toLowerCase()
      filtered = filtered.filter(opp => 
        opp.title?.toLowerCase().includes(keywordSearch) ||
        opp.organizer_name?.toLowerCase().includes(keywordSearch) ||
        opp.location?.toLowerCase().includes(keywordSearch) ||
        opp.requirement?.toLowerCase().includes(keywordSearch) ||
        opp.benefit?.toLowerCase().includes(keywordSearch)
      )
      console.log(`🔍 Keyword "${filters.keyword}" → ${filtered.length} results`)
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.title.localeCompare(b.title))

    console.log(`📊 Final results: ${filtered.length} opportunities`)
    setFilteredOpportunities(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AuthProvider>
          <HeroSection1 />
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
          </div>
        </AuthProvider>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthProvider>
        <HeroSection1 />
        <SearchFilters onFiltersChange={handleFiltersChange} />
        
        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-gray-600 text-center mb-4">
            Showing <span className="font-bold text-red-500">{filteredOpportunities.length}</span> of <span className="font-bold">{allOpportunities.length}</span> opportunities
          </p>
        </div>

        <Card opportunities={filteredOpportunities} />
        <Wus />
        <FeedBack/>
        <TrustSection />
      </AuthProvider>
    </div>
  )
}