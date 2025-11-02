import Image from "next/image";
import CarInteractions from "@/app/components/cars/CarInteractions";
import type { Metadata } from "next";
import { Calendar, User, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/app/components/cars/ShareButton";
import { FavoriteButton } from "@/app/components/cars/FavoriteButton";
import { ViewTracker } from "@/app/components/cars/ViewTracker";
import { ReportButton } from "@/app/components/moderation/ReportButton";

async function getCar(id: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/cars/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) throw new Error("Car not found");
      throw new Error("Failed to load car");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { car } = await getCar(id);

  const owner = car.owner || "Anonymous";
  const addedOn = car.created_at ? dateFormatter.format(new Date(car.created_at)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pb-16">
      <ViewTracker carId={id} />
      {/* Back Button */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Link
          href="/garage"
          className="group inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur">
          <div className="relative aspect-video w-full">
            {car.imageUrl ? (
              <Image 
                src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl} 
                alt={car.model} 
                fill 
                className="object-cover" 
                priority 
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white/50">
                No image available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Featured Badge */}
            {car.isFeatured && (
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-xl">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-yellow-400">Featured</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="mb-2 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
                {car.model}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                {car.year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {car.year}
                  </span>
                )}
                <span className="text-white/30">•</span>
                <Link 
                  href={`/driver/${encodeURIComponent(owner)}`}
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <User className="h-3.5 w-3.5" />
                  {owner}
                </Link>
                {car.view_count > 0 && (
                  <>
                    <span className="text-white/30">•</span>
                    <span>{car.view_count} views</span>
                  </>
                )}
                {addedOn && (
                  <>
                    <span className="text-white/30">•</span>
                    <span>{addedOn}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <FavoriteButton carId={id} />
          <ShareButton carModel={car.model} carId={id} />
          <ReportButton contentType="car" contentId={id} />
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Story */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">Story</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
                {car.description || "No story shared yet."}
              </p>
            </div>

            {/* Specifications */}
            {car.specs?.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur">
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/40">Specifications</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {car.specs.map((spec: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded border border-white/10 bg-white/[0.03] px-4 py-2.5"
                    >
                      <div className="h-1 w-1 rounded-full bg-white/40" />
                      <span className="text-sm text-white/70">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions */}
            <CarInteractions carId={id} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Build Details */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur">
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
                Build Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-white/50">Owner</dt>
                  <dd className="mt-1 text-base font-medium text-white">
                    <Link 
                      href={`/driver/${encodeURIComponent(owner)}`}
                      className="hover:text-white/80 transition"
                    >
                      {owner}
                    </Link>
                  </dd>
                </div>
                {car.year && (
                  <div>
                    <dt className="text-xs text-white/50">Model Year</dt>
                    <dd className="mt-1 text-base font-medium text-white">{car.year}</dd>
                  </div>
                )}
                {addedOn && (
                  <div>
                    <dt className="text-xs text-white/50">Added</dt>
                    <dd className="mt-1 text-base font-medium text-white">{addedOn}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {car.tags?.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map((tag: string, index: number) => (
                    <Link
                      key={index}
                      href={`/garage?tag=${encodeURIComponent(tag)}`}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white/80"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const { car } = await getCar(id);
    const title = `${car.model} — ${car.owner || 'Driver'} | Cult of Drive`;
    const description = (car.description || '').slice(0, 160) || `Check out this ${car.model} build from ${car.owner || 'the community'}.`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: car.imageUrl ? [{
          url: car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl,
          width: 1200,
          height: 630,
          alt: car.model,
        }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: car.imageUrl ? [car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Car Not Found | Cult of Drive',
      description: 'This car listing could not be found.',
    };
  }
}
