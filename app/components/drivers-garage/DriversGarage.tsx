"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCars } from "../hooks/useCars";
import type { Car } from "../types/car.types";
import GarageHeader from "./GarageHeader";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import ShareCTA from "../bottom-components/ShareCTA";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DriversGarage() {
  const { cars, loading, error } = useCars();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  if (loading) {
    return (
      <section className="px-4 py-16 text-center text-white bg-gradient-to-b from-black to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin" />
          <p>Loading garage...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-16 text-center text-white bg-gradient-to-b from-black to-gray-900">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="mx-auto max-w-7xl">
        <GarageHeader />

        {/* Cars Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              index={i}
              onClick={() => setSelectedCar(car)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <ShareCTA />
        </motion.div>

        {/* Modal */}
        <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      </div>
    </section>
  );
}
