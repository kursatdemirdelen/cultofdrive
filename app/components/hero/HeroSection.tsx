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
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <div className="p-10 border bg-black/50 backdrop-blur-lg rounded-xl border-white/5 md:p-12">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="mb-3 text-5xl font-heading tracking-[0.12em] text-white md:text-6xl">
              CULT OF DRIVE
            </h1>

            {/* BMW Affinity Accent */}
            <div className="mx-auto mb-6 h-[3px] w-[180px] bg-gradient-to-r from-[#00a0ff] via-[#0055ff] to-[#c40000] rounded-full opacity-90" />

            <p className="max-w-lg mx-auto mb-8 text-[17px] text-gray-300 tracking-wide leading-relaxed">
              Experience the golden era of BMW — analog machines built for
              drivers, not passengers.
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
