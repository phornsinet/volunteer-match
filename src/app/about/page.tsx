"use client";
import React from "react";
import Navi from "@/components/Navbar/navigation";
import { HeroSection3 } from "@/components/Hero-Section/hero-section3";
import { Footer } from "@/components/Footer/footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection3 />
      <section className="py-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-400 text-white px-8 py-4 mb-8">
            <h2 className="text-2xl font-bold mb-5 text-center">About Us</h2>
            <p className="text-lg leading-relaxed text-center">
              Remarkable Network is a global volunteer matching platform
              committed to connecting people who want to help with organizations
              that need support. We believe that everyone has something valuable
              to give, and that volunteering is one of the most powerful ways to
              create real change in the world.
            </p>
            <p className="text-lg leading-relaxed text-center">
              Our platform allows volunteers to discover opportunities that
              match their skills, passions, and availability, while providing
              nonprofits, NGOs, and community organizations with the tools they
              need to recruit, manage, and engage volunteers effectively.
            </p>
            <p className="text-lg leading-relaxed text-center">
              Whether you're passionate about education, healthcare, the
              environment, or social justice — Remarkable Network is here to
              help you take action and be part of something bigger.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 items-center">
            <div className="text-right">
              <p className="text-lg leading-relaxed text-gray-800 font-medium">
                Remarkable Network empowers individuals and organizations across
                the globe by providing a digital platform that connects
                volunteers with causes, promotes community-driven action, and
                supports sustainable, inclusive development through service.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/b1.png"
                  alt="Diverse volunteers with gear illustration"
                  width={300}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-left">
              <p className="text-lg leading-relaxed text-gray-800 font-medium">
                To create a world where every person has the opportunity to
                contribute, connect, and create meaningful change through
                volunteer service—no matter where they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-4">
          <div className="flex-1 md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
              Our Founder
            </h2>
            <blockquote className="text-lg leading-relaxed text-gray-800 font-medium text-left">
              "When I started Remarkable Network, I had one simple belief: that
              everyone, everywhere, has the power to make a difference. I’ve
              seen firsthand how even the smallest act of kindness—teaching a
              child, planting a tree, offering a hand—can change lives. This
              platform was born out of a desire to connect good people with good
              causes. Around the world, there are passionate individuals ready
              to serve, and organizations in need of their support. Remarkable
              Network is here to bridge that gap—to make it easier, faster, and
              more meaningful to volunteer. My vision is a global community
              where service is not a duty, but a shared joy. Whether you're a
              student, a working professional, or a retiree, your time and
              skills matter. Together, we can build something truly remarkable.
              Thank you for believing in the power of people."
            </blockquote>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-90 h-106">
              <img
                src="b2.png"
                alt="Phorn Sinet"
                className="absolute inset-0 w-full h-full object-cover "
                style={{ clipPath: "url(#founder-clip)" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
