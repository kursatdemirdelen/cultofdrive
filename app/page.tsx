"use client";

import SocialFeed from "./components/social-feed/SocialFeed";
import DriversGarage from "./components/drivers-garage/DriversGarage";
import HeroSection from "./components/hero/HeroSection";
import Footer from "./components/bottom-components/Footer";
import { StatsSection } from "./components/home/StatsSection";
import { RecentCars } from "./components/home/RecentCars";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroSection />
      <StatsSection />
      <section id="garage">
        <DriversGarage />
      </section>
      <RecentCars />
      <section id="social-feed">
        <SocialFeed />
      </section>
      <Footer />
    </main>
  );
}
