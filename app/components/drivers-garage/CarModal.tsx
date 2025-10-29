"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { UserCircle } from "lucide-react";
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_30px_rgba(0,0,0,0.35)]"
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Header */}
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <Image
              src={car.imageUrl}
              alt={car.model}
              fill
              className="object-cover"
            />

            <button
              onClick={onClose}
              className="absolute p-2 transition rounded-full top-4 right-4 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="mb-2 text-3xl font-heading tracking-[0.04em] text-white/90">
              {car.model}
            </h3>

            <p className="flex items-center gap-2 mb-4 text-sm text-white/80">
              <UserCircle className="w-5 h-5 text-white/70" />
              {car.owner}
            </p>

            <p className="mb-6 text-white/75">{car.description}</p>

            <CarSpecs specs={car.specs} />
            <CarTags tags={car.tags} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

