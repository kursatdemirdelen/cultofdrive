"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Share2 } from "lucide-react";
import HeroImage from "./HeroImage";
import CommunitySection from "./CommunitySection";

interface HeroSectionProps {
  scrollToSection?: (id: string) => void;
}

const actionClasses =
  "flex items-center gap-2 rounded-md bg-carbon/50 px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white/80 transition hover:bg-carbon/60 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]";

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  const router = useRouter();
  const handleExplore = () => {
    if (scrollToSection) {
      scrollToSection("garage");
      return;
    }
    router.push("/garage");
  };

  return (
    <div className="relative z-10 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl"
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm md:p-12">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs uppercase tracking-[0.3em] text-white/40"
                >
                  Now live
                </motion.span>
                <h1 className="text-6xl font-heading tracking-[0.12em] text-white md:text-7xl lg:text-8xl">
                  CULT OF
                  <br />
                  DRIVE
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-white/60">
                  A curated garage for 90s–2000s BMW icons. Browse authentic builds and share your driver-focused story.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/garage" 
                  className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  <Car className="h-4 w-4" />
                  Discover builds
                </Link>
                <Link 
                  href="/garage/add" 
                  className="group flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white/60 transition hover:border-white/20 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  Share your build
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <HeroImage />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <CommunitySection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
