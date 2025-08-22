export function StorySection() {
  return (
    <div className="py-30 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="lg:w-1/5">
            <div className="bg-red-400  text-white px-6 py-3 font-bold text-lg text-center">Our Story</div>
          </div>
          <div className="lg:w-4/5">
            <div className="space-y-5 text-black-700 leading-relaxed">
              <p className="text-lg px-3">
                Volunteer World was created with one goal in mind — to connect people who want to help with those that
                need them most. We saw passionate individuals looking for a way to give back and communities needing
                support, so we built a platform to bring them together.
              </p>
              <p className="text-lg px-3">
                From small local projects to larger community efforts, we believe everyone has something valuable to
                offer. Volunteer World is here to make volunteering easy, meaningful, and impactful — for everyone,
                everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
