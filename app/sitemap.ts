import type { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofdrive.com";

  // Fetch cars directly from database
  let cars: Array<{ id: string; created_at: string }> = [];
  try {
    const { data } = await supabase
      .from("cars")
      .select("id, created_at")
      .order("created_at", { ascending: false });
    cars = data || [];
  } catch (error) {
    console.error("Failed to fetch cars for sitemap:", error);
  }

  // Fetch driver profiles
  let drivers: Array<{ slug: string; updated_at: string }> = [];
  try {
    const { data } = await supabase
      .from("user_profiles")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false });
    drivers = data || [];
  } catch (error) {
    console.error("Failed to fetch drivers for sitemap:", error);
  }

  // Static routes
  const routes = [
    "",
    "/garage",
    "/marketplace",
    "/auth",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic car routes
  const carRoutes = cars.map((car) => ({
    url: `${baseUrl}/cars/${car.id}`,
    lastModified: new Date(car.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Driver profile routes
  const driverRoutes = drivers.map((driver) => ({
    url: `${baseUrl}/driver/${driver.slug}`,
    lastModified: new Date(driver.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...carRoutes, ...driverRoutes];
}
