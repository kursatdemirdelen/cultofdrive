"use client";

import { useState, useEffect, useMemo } from "react";
import type { Car } from "../types/car.types";

type UseCarsParams = {
  q?: string;
  owner?: string;
  tag?: string;
  userId?: string;
  limit?: number;
  featured?: boolean;
};

export function useCars(params?: UseCarsParams) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(() => 
    JSON.stringify(params || {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params?.q, params?.owner, params?.tag, params?.userId, params?.limit, params?.featured]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (params?.q) qs.set("q", params.q);
        if (params?.owner) qs.set("owner", params.owner);
        if (params?.tag) qs.set("tag", params.tag);
        if (params?.userId) qs.set("user_id", params.userId);
        if (params?.limit) qs.set("limit", String(params.limit));
        if (params?.featured !== undefined) qs.set("featured", String(params.featured));

        const res = await fetch(`/api/cars${qs.toString() ? `?${qs.toString()}` : ""}`, {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch cars");
        }

        const { cars } = await res.json();
        setCars(cars);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("/api/cars error:", err);
        setCars([]);
        setError("Failed to load cars");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return { cars, loading, error };
}
