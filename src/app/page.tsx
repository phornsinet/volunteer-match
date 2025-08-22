import { HeroSection } from "@/components/Hero-Section/hero-section"
import { StorySection } from "@/components/story-section"
import { StatisticsSection } from "@/components/statistics-section"
import { VolunteerReflection } from "@/components/Reflection/volun-reflection"

import { TrustSection } from "@/components/trust"
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StorySection />
      <StatisticsSection />
      <VolunteerReflection />
      <TrustSection/>

    </div>
  )
}
