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
    <section className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-2 text-5xl font-light tabular-nums text-white">{stats.cars}</p>
            <p className="text-sm text-white/50">Builds</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-2 text-5xl font-light tabular-nums text-white">{stats.views.toLocaleString()}</p>
            <p className="text-sm text-white/50">Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-2 text-5xl font-light tabular-nums text-white">{stats.favorites}</p>
            <p className="text-sm text-white/50">Favorites</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
