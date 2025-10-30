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
    <div className="relative z-10 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 pb-16 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-glow backdrop-blur-lg">
          <div className="grid gap-10 p-8 md:grid-cols-[1.1fr,0.9fr] md:p-12">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.38em] text-white/60">
                Now live
              </span>
              <h1 className="text-4xl font-heading tracking-[0.16em] text-white md:text-5xl">
                CULT OF DRIVE
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                A curated garage for 90s&ndash;2000s BMW icons. Browse authentic builds, dive into detailed spec sheets, and add your own driver-focused BMW story to the community.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/garage" className={actionClasses}>
                  <Car className="h-4 w-4 text-white/65" />
                  Discover builds
                </Link>
                <Link href="/garage/add" className={actionClasses}>
                  <Share2 className="h-4 w-4 text-white/65" />
                  Share your build
                </Link>
              </div>
            </div>

            <HeroImage />
          </div>

          <div className="px-8 pb-10 md:px-12">
            <CommunitySection />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
