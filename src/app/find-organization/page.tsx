"use client"
import { HeroSection2 } from "@/components/Hero-Section/hero-section2"
import { SearchFilters } from "@/components/searchfilters"
import Card1 from "@/components/Card-Section/card1"
import Wus from "@/components/wus"
import FeedBack from "@/components/Reflection/v1"
import { TrustSection } from "@/components/trust" 



export default function FindOpportunitiesPage2() {
    return (
    <div className="min-h-screen bg-white">
      <HeroSection2/>
      <SearchFilters />
      <Card1 />
      <Wus />
      <FeedBack />
      <TrustSection />
    </div>
  )
}
