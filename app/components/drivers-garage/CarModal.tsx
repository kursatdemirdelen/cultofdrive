"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Car } from "../types/car.types";
import CarSpecs from "./CarSpecs";
import CarTags from "./CarTags";

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Header */}
          <div className="relative h-64 rounded-t-xl">
            <Image
              src={car.imageUrl}
              alt={car.model}
              fill
              className="object-cover rounded-t-xl"
            />
            <button
              onClick={onClose}
              className="absolute p-2 text-white transition-colors rounded-full top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="mb-2 text-2xl font-medium text-white">
              {car.model}
            </h3>
            <p className="mb-4 text-sm text-blue-400">Owner: {car.owner}</p>
            <p className="mb-6 text-gray-300">{car.description}</p>

            <CarSpecs specs={car.specs} />
            <CarTags tags={car.tags} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
