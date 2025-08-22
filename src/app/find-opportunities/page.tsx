"use client"
import { HeroSection1} from "@/components/Hero-Section/hero-section1"
import { SearchFilters } from "@/components/searchfilters"
import Card from "@/components/Card-Section/card"
import Wus from "@/components/wus"
import FeedBack from "@/components/Reflection/v1"
import { TrustSection } from "@/components/trust" 



export default function FindOpportunitiesPage() {
    return (
    <div className="min-h-screen bg-white">
      <HeroSection1 />
      <SearchFilters />
      <Card />
      <Wus />
      <FeedBack />
      <TrustSection />
    </div>
  )
}


