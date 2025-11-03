"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";

type Driver = {
  owner: string;
  slug: string;
  avatar_url?: string;
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
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-heading tracking-[0.12em] text-white sm:text-3xl">
            COMMUNITY HIGHLIGHTS
          </h2>
          <p className="mt-2 text-sm text-white/50">Top contributors</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {drivers.slice(0, 8).map((driver) => (
            <Link
              key={driver.owner}
              href={`/driver/${driver.slug}`}
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <Avatar
                src={driver.avatar_url}
                alt={driver.owner}
                size="lg"
                className="mb-2 ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-white/20"
              />
              <h3 className="max-w-[80px] truncate text-xs font-medium text-white/90 transition-colors group-hover:text-white">
                {driver.owner}
              </h3>
              <p className="text-[10px] text-white/40">
                {driver.car_count} {driver.car_count === 1 ? "build" : "builds"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
