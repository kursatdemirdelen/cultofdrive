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
      <h2 className="mb-4 text-3xl font-light text-white">
        Driver&apos;s Garage
      </h2>
      <p className="max-w-2xl mx-auto text-gray-400">
        Showcasing the finest BMWs from our community. Each car tells a story.
      </p>
    </motion.div>
  );
}
