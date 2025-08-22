import { Button } from "@/components/ui/button";

export default function Wus() {
  return (
    <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-15">
            <div className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 font-bold text-lg inline-block">
              Why You Should Volunteer
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="/w1.jpg"
                  alt="Make a positive impact"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">Make a Positive Impact</h3>
              <p className="text-gray-600">
                Volunteering allows you to help others and strengthen your community. Whether you're supporting
                education, health, the environment, or social programs, your time and effort can create real, lasting
                change in people's lives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                src="/w2.avif" 
                alt="Learn and grow" 
                className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-4">Learn and Grow</h3>
              <p className="text-gray-600">
                Volunteering is a chance to gain new skills, build confidence, and discover your passions. You'll
                develop leadership, communication, teamwork, and problem-solving strengths. You can improve your
                conversations, teamwork, and problem-solving skills—especially helpful for students and job seekers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="/w3.jpg"
                  alt="Connect with others"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-4">Connect with Others</h3>
              <p className="text-gray-600">
                Volunteering helps you meet new people who share your values and passions. It builds friendships,
                strengthens social bonds, and helps you feel more connected to your community and the world around you.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}

