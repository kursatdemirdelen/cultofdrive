"use client";

import { motion } from "framer-motion";

export default function SocialFeedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      <h2 className="text-4xl font-heading tracking-[0.05em] text-white/90">
        Community Highlights
      </h2>
      <div className="mx-auto mt-2 mb-4 h-[2px] w-[80px] bg-gradient-to-r from-[#00a0ff] via-[#0055ff] to-[#c40000] opacity-70" />
      <p className="max-w-2xl mx-auto text-white/60">
        Real drivers. Real stories. Experience the culture of drive.
      </p>
    </motion.div>
  );
}
