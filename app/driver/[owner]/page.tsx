import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Car, Calendar } from "lucide-react";
import type { Metadata } from "next";

async function getDriverCars(owner: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/cars?owner=${encodeURIComponent(owner)}&limit=50`, { 
    cache: "no-store" 
  });
  if (!res.ok) return { cars: [] };
  return res.json();
}

export default async function DriverPage({ params }: { params: Promise<{ owner: string }> }) {
  const { owner } = await params;
  const decodedOwner = decodeURIComponent(owner);
  const { cars } = await getDriverCars(decodedOwner);

  if (!cars || cars.length === 0) {
    notFound();
  }

  const totalCars = cars.length;
  const featuredCars = cars.filter((c: any) => c.isFeatured).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">Driver Profile</p>
              <h1 className="mb-4 font-heading text-4xl tracking-[0.12em] text-white">
                {decodedOwner}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {totalCars} {totalCars === 1 ? "Build" : "Builds"}
                </div>
                {featuredCars > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    {featuredCars} Featured
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-white">All Builds</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: any) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl}
                    alt={car.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {car.isFeatured && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
                      <span className="text-xs text-yellow-400">★ Featured</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-white">{car.model}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    {car.year && (
                      <>
                        <Calendar className="h-3.5 w-3.5" />
                        {car.year}
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ owner: string }> }): Promise<Metadata> {
  const { owner } = await params;
  const decodedOwner = decodeURIComponent(owner);
  return {
    title: `${decodedOwner}'s Garage | Cult of Drive`,
    description: `Browse ${decodedOwner}'s BMW builds and collection on Cult of Drive.`,
  };
}
