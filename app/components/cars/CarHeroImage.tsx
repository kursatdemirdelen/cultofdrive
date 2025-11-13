import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { CarBadges } from "./CarBadges";
import { CarMetadata } from "./CarMetadata";

interface CarHeroImageProps {
  imageUrl?: string;
  model: string;
  createdAt?: string;
  isFeatured?: boolean;
  year?: number;
  owner: string;
  driverSlug?: string | null;
  viewCount?: number;
  addedOn?: string | null;
}

export function CarHeroImage({ 
  imageUrl, 
  model, 
  createdAt, 
  isFeatured, 
  year, 
  owner, 
  driverSlug, 
  viewCount, 
  addedOn 
}: CarHeroImageProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur">
      <div className="relative aspect-video w-full">
        {imageUrl ? (
          <Image 
            src={getImageUrl(imageUrl)} 
            alt={model} 
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
        
        <CarBadges createdAt={createdAt} isFeatured={isFeatured} />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h1 className="mb-2 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            {model}
          </h1>
          <CarMetadata 
            year={year} 
            owner={owner} 
            driverSlug={driverSlug} 
            viewCount={viewCount} 
            addedOn={addedOn} 
          />
        </div>
      </div>
    </div>
  );
}
