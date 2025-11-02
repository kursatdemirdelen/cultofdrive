import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofdrive.com";

  // Fetch all cars for dynamic routes
  let cars: Array<{ id: string; created_at: string }> = [];
  try {
    const res = await fetch(`${baseUrl}/api/cars`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      cars = data.cars || [];
    }
  } catch (error) {
    console.error("Failed to fetch cars for sitemap:", error);
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

  return [...routes, ...carRoutes];
}
