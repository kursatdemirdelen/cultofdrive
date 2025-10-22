"use client";

import SocialFeed from "./components/social-feed/SocialFeed";
import DriversGarage from "./components/drivers-garage/DriversGarage";
import HeroSection from "./components/hero/HeroSection";
import Footer from "./components/bottom-components/Footer";

export default function Home() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
        {/* Radial grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />

        {/* Hero Section */}
        <HeroSection scrollToSection={scrollToSection} />

        {/* Social Feed */}
        <section id="social-feed">
          <SocialFeed />
        </section>

        {/* Driver's Garage */}
        <section id="garage">
          <DriversGarage />
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
