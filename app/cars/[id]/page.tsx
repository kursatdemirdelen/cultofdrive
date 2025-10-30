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
  const res = await fetch(`${base}/api/cars/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load car");
  return res.json();
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 pb-16">
      <ViewTracker carId={id} />
      {/* Back Button & Actions */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
        <Link
          href="/garage"
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>
        <div className="flex items-center gap-2">
          <FavoriteButton carId={id} />
          <ShareButton carModel={car.model} carId={id} />
          <ReportButton contentType="car" contentId={id} />
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-glow backdrop-blur">
          <div className="relative aspect-video w-full">
            {car.imageUrl ? (
              <Image 
                src={car.imageUrl.startsWith('public/') ? `/${car.imageUrl.replace('public/', '')}` : car.imageUrl} 
                alt={car.model} 
                fill 
                className="object-cover" 
                priority 
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
              <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-yellow-500/30 bg-black/60 px-4 py-2 backdrop-blur">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">Featured</span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="mb-3 font-heading text-4xl tracking-[0.12em] text-white md:text-5xl">
                {car.model}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                {car.year && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {car.year}
                  </span>
                )}
                <Link 
                  href={`/driver/${encodeURIComponent(owner)}`}
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                  {owner}
                </Link>
                {car.view_count > 0 && (
                  <span className="text-white/60">{car.view_count} views</span>
                )}
                {addedOn && (
                  <span className="text-white/60">Added {addedOn}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Story */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-semibold text-white">Story</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
                {car.description || "No story shared yet."}
              </p>
            </div>

            {/* Specifications */}
            {car.specs?.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="mb-4 text-xl font-semibold text-white">Specifications</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {car.specs.map((spec: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      <span className="text-sm text-white/85">{spec}</span>
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
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
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
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map((tag: string, index: number) => (
                    <Link
                      key={index}
                      href={`/garage?tag=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
                    >
                      #{tag}
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
    const description = (car.description || '').slice(0, 160) || 'BMW build from the Cult of Drive community.';
    const images: any = car.imageUrl ? [{ url: car.imageUrl, width: 1200, height: 630, alt: car.model }] : [];
    return {
      title,
      description,
      openGraph: { title, description, images },
      twitter: { card: 'summary_large_image', title, description, images: images.map((i: any) => i.url) },
    };
  } catch {
    return { title: 'Cult of Drive', description: 'Curated BMW builds and driver stories.' } as Metadata;
  }
}
