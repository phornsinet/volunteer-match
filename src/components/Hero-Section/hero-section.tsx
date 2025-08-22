import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/hero1.jpg')`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight ">
            Volunteer World is a platform where individuals and organizations come together to create impact. Whether
            you're looking to offer your time, skills, or energy, or you need passionate volunteers for your cause —
            this is the place for you.
          </h1>
          <Link href="/find-opportunities">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-bold transition-transform duration-200 hover:scale-105">
            Let's Start
              </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
