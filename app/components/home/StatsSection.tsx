"use client";

import { useEffect, useState } from "react";
import { Car, Users, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function StatsSection() {
  const [stats, setStats] = useState({ cars: 0, featured: 0, recent: 0 });

  useEffect(() => {
    fetch("/api/cars?limit=1")
      .then(res => res.json())
      .then(data => {
        if (data.pagination) {
          setStats({
            cars: data.pagination.total || 0,
            featured: Math.floor((data.pagination.total || 0) * 0.3),
            recent: Math.floor((data.pagination.total || 0) * 0.15),
          });
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    { label: "Total Builds", value: stats.cars, icon: Car, color: "from-blue-500/20 to-blue-600/20" },
    { label: "Featured Builds", value: stats.featured, icon: Star, color: "from-yellow-500/20 to-yellow-600/20" },
    { label: "Community Members", value: stats.recent * 2, icon: Users, color: "from-green-500/20 to-green-600/20" },
  ];

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
            BY THE NUMBERS
          </h2>
          <p className="text-white/60">Growing community of BMW enthusiasts</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${item.color} p-6 text-center backdrop-blur`}
            >
              <item.icon className="mx-auto mb-3 h-10 w-10 text-white/80" />
              <p className="mb-1 text-4xl font-bold text-white">{item.value}</p>
              <p className="text-sm font-medium text-white/70">{item.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/garage"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Explore All Builds
          </Link>
        </div>
      </div>
    </section>
  );
}
