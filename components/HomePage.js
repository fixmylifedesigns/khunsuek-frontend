import React from "react";
import Image from "next/image";
import banner from "../public/KSM-HOME-Hotspot.jpg";

// Home page component for the Muay Thai gym website
const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <div className="relative w-full h-[600px]">
        <Image
          src={banner}
          alt="Muay Thai training"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            KRABI&apos;S BEST MUAY THAI GYM
          </h1>
          <p className="text-xl mb-8">
            Experience authentic Muay Thai training in the heart of Thailand
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Book a Class
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose KHUNSUEK?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Expert Trainers"
            description="Learn from experienced Muay Thai champions and certified instructors"
          />
          <FeatureCard
            title="Modern Facilities"
            description="Train in our state-of-the-art gym with top-quality equipment"
          />
          <FeatureCard
            title="All Levels Welcome"
            description="Whether you're a beginner or a pro, we have classes for every skill level"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable component for feature cards
const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default HomePage;
