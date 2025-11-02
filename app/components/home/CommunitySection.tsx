"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Link from "next/link";

type Driver = {
  owner: string;
  slug: string;
  car_count: number;
};

export function CommunitySection() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch("/api/drivers/top");
        const data = await res.json();
        setDrivers(data.drivers || []);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) return null;
  if (drivers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-white/60" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-white/40">
              Community
            </h2>
          </div>
          <h3 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
            Top Contributors
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drivers.slice(0, 8).map((driver) => (
            <Link
              key={driver.owner}
              href={`/driver/${driver.slug}`}
              className="group rounded-lg border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm transition hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {driver.owner.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white group-hover:text-white/80 transition">
                    {driver.owner}
                  </p>
                  <p className="text-xs text-white/50">
                    {driver.car_count} {driver.car_count === 1 ? "build" : "builds"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
