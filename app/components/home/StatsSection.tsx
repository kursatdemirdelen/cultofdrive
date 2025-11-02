"use client";

import { useEffect, useState } from "react";
import { Car, Eye, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function StatsSection() {
  const [stats, setStats] = useState({ cars: 0, views: 0, favorites: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/cars?limit=1").then(res => res.json()),
      fetch("/api/cars/stats").then(res => res.json()).catch(() => ({ views: 0, favorites: 0 }))
    ])
      .then(([carsData, statsData]) => {
        setStats({
          cars: carsData.pagination?.total || 0,
          views: statsData.views || 0,
          favorites: statsData.favorites || 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-1 text-4xl font-light tabular-nums text-white sm:mb-2 sm:text-5xl">{stats.cars}</p>
            <p className="text-xs text-white/50 sm:text-sm">Builds</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-1 text-4xl font-light tabular-nums text-white sm:mb-2 sm:text-5xl">{stats.views.toLocaleString()}</p>
            <p className="text-xs text-white/50 sm:text-sm">Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-1 text-4xl font-light tabular-nums text-white sm:mb-2 sm:text-5xl">{stats.favorites}</p>
            <p className="text-xs text-white/50 sm:text-sm">Favorites</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
