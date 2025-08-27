export function HeroSection3() {
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
            About Volunteer World
          </h1>
        </div>
      </div>
    </div>
  )
}
