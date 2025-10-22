"use client";

import { motion } from "framer-motion";
import HeroNavigation from "./HeroNavigation";
import HeroImage from "./HeroImage";
import CommunitySection from "./CommunitySection";

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <div className="p-12 bg-black/40 backdrop-blur-xl rounded-xl md:p-12">
          {/* Header */}
          <header className="mb-6 text-center">
            <h1 className="mb-4 text-4xl font-light text-white md:text-5xl">
              Cult of Drive
            </h1>
            <p className="max-w-lg mx-auto text-lg text-gray-400">
              Experience the golden era of BMW. Pure driving machines, no
              compromises.
            </p>

            <HeroNavigation onNavigate={scrollToSection} />
          </header>

          <HeroImage />
          <CommunitySection />
        </div>
      </motion.div>
    </div>
  );
}
