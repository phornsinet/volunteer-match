import React from "react";
import Image from "next/image";

export default function FeedBackOrga() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-12">
          <div className="bg-red-400 text-white px-6 py-3 font-bold text-lg inline-block">
            Volunteer
          </div>
        </div>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-start gap-15">
            <div className="md:w-40 flex-shrink-0">
              <div className="w-50 h-30 rounded-lg">
                <Image
                  src="/Kirirom.png"
                  alt="Kirirom"
                  width={200}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-black-700 text-lg mb-4">
                &quot;Partnering with Volunteer World has brought incredible value to
                our community outreach projects. The platform connected us with
                skilled and passionate volunteers who were eager to support our
                education programs. We learned that when technology meets
                compassion, the results can be truly powerful. Through this
                collaboration, we improved our project delivery, strengthened
                youth engagement, and built long-term relationships with
                volunteers who care about our mission. Volunteer World has
                become a trusted partner in driving positive change.&quot;
              </blockquote>
              <div className="text-sm text-black-600 mb-4">
                <div className="font-semibold">Kunthy</div>
                <div>Volunteer, Phnom Penh</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-start gap-4">
            <div className="md:w-40 flex-shrink-0">
              <div className="w-40 h-50 bg-red-400 rounded-lg ">
                <Image
                  src="/pact.jpg"
                  alt="Pact"
                  width={160}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-black-700 text-lg text-right mb-4">
                &quot;Through Volunteer World, I joined a health awareness campaign
                in local communities. What I learned was more than just
                knowledge about public health—I discovered how important
                communication and teamwork are. I also realized that
                volunteering is not only about support, but also about respect,
                listening, and building trust. This experience inspired me to
                continue serving and even consider a career in community
                development.&quot;
              </blockquote>
              <div className="text-sm text-black-600 text-right mb-4">
                <div className="font-semibold">Chanthy& Chatha</div>
                <div>Volunteer, New York</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
