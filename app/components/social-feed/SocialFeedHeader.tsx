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
      <h2 className="text-4xl font-light text-white">Community Highlights</h2>
      <p className="max-w-2xl mx-auto mt-3 text-gray-400">
        Real drivers. Real stories. Experience the culture of drive.
      </p>
    </motion.div>
  );
}
