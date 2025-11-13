import CarInteractions from "@/app/components/cars/CarInteractions";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/app/components/cars/ShareButton";
import { FavoriteButton } from "@/app/components/cars/FavoriteButton";
import { ViewTracker } from "@/app/components/cars/ViewTracker";
import { ReportButton } from "@/app/components/moderation/ReportButton";
import { CarHeroImage } from "@/app/components/cars/CarHeroImage";
import { CarStory } from "@/app/components/cars/CarStory";
import { CarSpecs } from "@/app/components/cars/CarSpecs";
import { CarSidebar } from "@/app/components/cars/CarSidebar";
import { getImageUrl } from "@/utils/image";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-16">
      <ViewTracker carId={id} />

      <section className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <CarHeroImage
          imageUrl={car.imageUrl}
          model={car.model}
          createdAt={car.created_at}
          isFeatured={car.isFeatured}
          year={car.year}
          owner={owner}
          driverSlug={car.driverSlug}
          viewCount={car.view_count}
          addedOn={addedOn}
        />
        
        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link
            href="/garage"
            className="group inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70 backdrop-blur-sm transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <FavoriteButton carId={id} />
            <ShareButton carModel={car.model} carId={id} />
            <ReportButton contentType="car" contentId={id} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <CarStory description={car.description} />
            <CarSpecs specs={car.specs} />
            <CarInteractions carId={id} />
          </div>

          <CarSidebar
            owner={owner}
            driverSlug={car.driverSlug}
            year={car.year}
            addedOn={addedOn}
            tags={car.tags}
          />
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
          url: getImageUrl(car.imageUrl),
          width: 1200,
          height: 630,
          alt: car.model,
        }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: car.imageUrl ? [getImageUrl(car.imageUrl)] : [],
      },
    };
  } catch {
    return {
      title: 'Car Not Found | Cult of Drive',
      description: 'This car listing could not be found.',
    };
  }
}
