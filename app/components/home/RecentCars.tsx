"use client";

import { useCars } from "../hooks/useCars";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { NewBadge } from "../ui/NewBadge";
import { isNew } from "@/utils/date";
import { resolveImageSource } from "@/utils/storage";

export function RecentCars() {
  const { cars, loading } = useCars({ limit: 6 });

  if (loading) {
    return (
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
              RECENT ADDITIONS
            </h2>
            <div className="mx-auto mt-2 h-4 w-48 rounded bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <div className="relative aspect-video overflow-hidden bg-white/10">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </div>
                  <div className="h-4 w-1/2 rounded bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
              RECENT ADDITIONS
            </h2>
            <p className="text-white/60">Latest builds from the community</p>
          </div>
          <Link
            href="/garage"
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/cars/${car.id}`}
                className="group block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition hover:bg-white/[0.04]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={resolveImageSource(car.imageUrl) || "/images/placeholder-car.jpg"}
                    alt={car.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {car.created_at && isNew(car.created_at) && (
                    <div className="absolute left-3 top-3">
                      <NewBadge />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-white">{car.model}</h3>
                  <p className="text-sm text-white/60">
                    {car.year && `${car.year} • `}
                    {car.owner}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
