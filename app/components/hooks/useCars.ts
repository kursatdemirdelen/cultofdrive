"use client";

import { useState, useEffect } from "react";
import type { Car } from "../types/car.types";

export function useCars(params?: { q?: string; owner?: string; tag?: string; userId?: string; preferLocalFirst?: boolean }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // If homepage wants local-first showcase, prefer local JSON and return
        if (params?.preferLocalFirst) {
          const res = await fetch("/data/cars.json");
          if (!res.ok) throw new Error("Failed to fetch cars");
          const data = await res.json();
          setCars(data);
          setLoading(false);
          return;
        }

        // Default: try dynamic API first
        const qs = new URLSearchParams();
        if (params?.q) qs.set('q', params.q);
        if (params?.owner) qs.set('owner', params.owner);
        if (params?.tag) qs.set('tag', params.tag);
        if (params?.userId) qs.set('user_id', params.userId);
        const apiRes = await fetch(`/api/cars${qs.toString() ? `?${qs.toString()}` : ''}`, { cache: "no-store" });
        if (apiRes.ok) {
          const { cars } = await apiRes.json();
          setCars(cars);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("/api/cars error:", e);
      }

      // Fallback to static JSON
      try {
        const res = await fetch("/data/cars.json");
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        setCars(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load cars");
        setLoading(false);
      }
    };

    load();
  }, [params?.q, params?.owner, params?.tag, params?.userId, params?.preferLocalFirst]);

  return { cars, loading, error };
}
