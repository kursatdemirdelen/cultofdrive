"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Car } from "../types/car.types";

interface CarCardProps {
  car: Car;
  index: number;
  onClick: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CarCard({ car, index, onClick }: CarCardProps) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.1 }}
      className="overflow-hidden transition-all border cursor-pointer rounded-xl bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        <Image
          src={car.imageUrl}
          alt={car.model}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-lg top-4 left-4 bg-black/50 backdrop-blur-sm">
          {car.year}
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-xl font-medium text-white">{car.model}</h3>
        <p className="mb-2 text-sm text-blue-400">Owner: {car.owner}</p>
        <p className="text-sm text-gray-300 line-clamp-3">{car.description}</p>
      </div>
    </motion.div>
  );
}
