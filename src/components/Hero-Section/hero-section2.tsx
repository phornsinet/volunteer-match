import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { redirect } from 'next/dist/server/api-utils';

export function HeroSection2() {
  return (
    <div
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/hero1.jpg')`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            Volunteer World is a platform where individuals and organizations
            come together to create impact. Whether you're looking to offer your
            time, skills, or energy, or you need passionate volunteers for your
            cause — this is the place for you.
          </h1>
          <div className="flex justify-center space-x-4">
            <Link href="/find-opportunities" >
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105">
                VOLUNTEER
              </Button>
            </Link>
            <Link href="/find-opportunities">
              <Button
              className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105">
                ORGANIZATION
              </Button>
            </Link>
            <Button className="bg-red-600 text-white-400 hover:bg-blue-400 px-6 py-2 font-semibold transition-transform duration-200 hover:scale-105 ml-auto">
              POST
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}