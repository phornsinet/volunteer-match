'use client';

export function HeroSection1({
  backgroundImageUrl = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/hero1.jpg')`,
  headingText = "Volunteer World is a platform where individuals and organizations come together to create impact. Whether you&apos;re looking to offer your time, skills, or energy, or you need passionate volunteers for your cause — this is the place for you.",
}) {
  return (
    <div
      className="relative h-96 bg-cover bg-center"
      style={{
        backgroundImage: backgroundImageUrl,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            {headingText}
          </h1>
        </div>
      </div>
    </div>
  );
}