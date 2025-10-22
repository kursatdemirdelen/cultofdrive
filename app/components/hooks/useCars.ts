"use client";

import { useState, useEffect } from "react";
import type { Car } from "../types/car.types";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/cars.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cars");
        return res.json();
      })
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load cars");
        setLoading(false);
      });
  }, []);

  return { cars, loading, error };
}