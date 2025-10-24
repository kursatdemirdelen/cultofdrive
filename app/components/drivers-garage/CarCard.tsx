"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Car } from "../types/car.types";
import { UserCircle } from "lucide-react";

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
      className="overflow-hidden transition-colors border rounded-lg cursor-pointer bg-carbon/40 border-white/5 hover:bg-carbon/50"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden rounded-t-lg">
        <Image
          src={car.imageUrl}
          alt={car.model}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          quality={90}
          placeholder="blur"
          blurDataURL="/images/e36-placeholder.png"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="
          absolute top-4 left-4 px-3 py-1 text-sm font-medium text-white/90
          bg-carbon/70 border border-white/10 rounded-[4px]
        "
        >
          {car.year}
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-xl font-medium text-white/90">{car.model}</h3>
        <p className="flex items-center gap-2 mb-4 text-sm text-white/80">
          <UserCircle className="w-5 h-5 text-white/70" />
          {car.owner}
        </p>
        <p className="text-sm text-white/60 line-clamp-3">{car.description}</p>
      </div>
    </motion.div>
  );
}
