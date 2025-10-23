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
      <main className="relative min-h-screen overflow-hidden ">
        {/* Hero Section */}
        <HeroSection scrollToSection={scrollToSection} />

        {/* Driver's Garage */}
        <section id="garage">
          <DriversGarage />
        </section>

        {/* Social Feed */}
        <section id="social-feed">
          <SocialFeed />
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
