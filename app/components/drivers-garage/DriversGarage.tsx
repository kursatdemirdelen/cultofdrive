'use client'

import { motion } from 'framer-motion'
import { useCars } from '../hooks/useCars'
import GarageHeader from './GarageHeader'
import CarCard from './CarCard'
import ShareCTA from '../bottom-components/ShareCTA'
import { useRouter } from 'next/navigation'
import { CarGridSkeleton } from '../loading/CarCardSkeleton'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function DriversGarage() {
  const { cars, loading, error } = useCars({ limit: 9, featured: true })
  const router = useRouter()

  if (loading) {
    return (
      <section className="px-4 py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="relative w-64 h-12 mx-auto mb-4 overflow-hidden rounded bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
            <div className="relative h-6 mx-auto overflow-hidden rounded w-96 bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          </div>
          <CarGridSkeleton count={6} />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 py-16 text-center text-white bg-gradient-to-b from-black via-slate-900 to-slate-950">
        <p className="text-red-400">{error}</p>
      </section>
    )
  }

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-black via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl">
        <GarageHeader />

        {cars.length === 0 ? (
          <div className="p-10 text-center border rounded-lg border-white/10 bg-black/40 backdrop-blur text-white/60">
            No featured cars yet. Mark a car as featured in the admin panel to
            display it here.
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
  )
}
