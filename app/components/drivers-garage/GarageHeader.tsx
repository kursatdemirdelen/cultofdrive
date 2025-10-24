"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function GarageHeader() {
  return (
    <motion.div {...fadeUp} className="mb-12 text-center">
      <h2 className="mb-3 text-4xl font-heading tracking-[0.05em] text-white/90">
        Driver&rsquo;s Garage
      </h2>
      <div className="mx-auto mb-4 h-[2px] w-[80px] bg-gradient-to-r from-[#00a0ff] via-[#0055ff] to-[#c40000] opacity-70" />
      <p className="max-w-2xl mx-auto text-white/60">
        Showcasing the finest BMWs from our community. Each car tells a story.
      </p>
    </motion.div>
  );
}
