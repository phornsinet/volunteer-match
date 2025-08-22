export function VolunteerReflection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-12">
          <div className="bg-red-400 text-white px-6 py-3 font-bold text-lg inline-block">
            Reflection From Volunteer
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-40 flex-shrink-0">
              <div className="w-55 h-55 bg-blue-500 rounded-lg overflow-hidden">
                <img 
                src="R1.png" 
                alt="Chan Dara" 
                className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-black-700 text-lg mb-4">
                "Joining Volunteer World changed the way I see community service. I always wanted to give back but
                didn't know where to start. This platform made it simple to connect with organizations that truly needed
                help. I volunteered at a local youth center, and the experience was more rewarding than I ever imagined.
                I built friendships, learned patience, and realized that even small efforts can create big impact.
                Volunteer World is not just a website — it's a bridge between hearts and communities."
              </blockquote>
              <div className="text-sm text-gray-600 mb-4">
                <div className="font-semibold">Chan Dara</div>
                <div>Volunteer, Phnom Penh</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-start gap-6">
            <div className="md:w-40 flex-shrink-0">
              <div className="w-50 h-50 bg-red-400 rounded-lg overflow-hidden">
                <img
                  src="R2.png"
                  alt="Sokunthy Noun"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-black-700 text-lg text-right mb-4">
                "Volunteering through Volunteer World opened my eyes to the real needs in our society. I helped with an
                environmental cleanup project, and it was inspiring to work with people who truly care about making a
                difference. The platform made it easy to find a cause I believed in, and I felt supported every step of
                the way. More than just giving back, I found purpose, confidence, and a deeper understanding of my role
                in the community. I'm proud to be part of the Volunteer World family."
              </blockquote>
              <div className="text-sm text-gray-600 text-right mb-4">
                <div className="font-semibold">Sokunthy Noun</div>
                <div>Volunteer, New York</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}