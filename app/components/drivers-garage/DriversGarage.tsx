"use client";

import { motion } from "framer-motion";
import { useCars } from "../hooks/useCars";
import GarageHeader from "./GarageHeader";
import CarCard from "./CarCard";
import ShareCTA from "../bottom-components/ShareCTA";
import { useRouter } from "next/navigation";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DriversGarage() {
  const { cars, loading, error } = useCars({ limit: 9, featured: true });
  const router = useRouter();

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-black to-gray-900 px-4 py-16 text-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <p>Loading garage...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-black to-gray-900 px-4 py-16 text-center text-white">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <GarageHeader />

        {cars.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/50 p-10 text-center text-white/60">
            No featured cars yet. Mark a car as featured in the admin panel to display it here.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <CarCard
                key={car.id}
                car={car}
                index={i}
                onClick={() => router.push(`/cars/${car.id}`)}
              />
            ))}
          </div>
        )}

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <ShareCTA />
        </motion.div>
      </div>
    </section>
  );
}
