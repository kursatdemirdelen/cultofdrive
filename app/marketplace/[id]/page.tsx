import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, DollarSign, MapPin, Mail, Phone, Calendar, Car, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { EditListingButton } from "@/app/components/marketplace/EditListingButton";
import { resolveImageSource } from "@/utils/storage";

async function getListing(id: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/marketplace/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getListing(id);

  if (!data?.listing) {
    notFound();
  }

  const { listing } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
          <EditListingButton listingId={id} sellerId={listing.seller_id} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {(listing.image_url || listing.cars?.image_url) ? (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={resolveImageSource(listing.image_url || listing.cars?.image_url) || "/images/placeholder-car.jpg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-black to-slate-950">
                <div className="flex h-full items-center justify-center text-white/50">
                  <div className="text-center">
                    <p className="text-lg">No image available</p>
                    <p className="mt-2 text-sm text-white/40">Custom listing without linked car</p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/80">
                {listing.listing_type === "car" ? (
                  <><Car className="h-4 w-4" /> Car</>
                ) : (
                  <><Wrench className="h-4 w-4" /> Part</>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold text-white">{listing.title}</h1>
              <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
                {listing.description}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                <span className="text-3xl font-bold text-white">
                  {listing.price.toLocaleString()}
                </span>
                <span className="text-white/60">{listing.currency}</span>
              </div>

              {listing.location && (
                <div className="mb-4 flex items-center gap-2 text-white/70">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
              )}

              <div className="mb-6 text-xs text-white/50">
                <Calendar className="mb-1 inline h-3.5 w-3.5" />
                {" "}Listed {new Date(listing.created_at).toLocaleDateString()}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Contact Seller
                </h3>
                {listing.contact_email && (
                  <a
                    href={`mailto:${listing.contact_email}`}
                    className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" />
                    Email Seller
                  </a>
                )}
                {listing.contact_phone && (
                  <a
                    href={`tel:${listing.contact_phone}`}
                    className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4" />
                    {listing.contact_phone}
                  </a>
                )}
              </div>
            </div>

            {listing.car_id && (
              <Link
                href={`/cars/${listing.car_id}`}
                className="block rounded-xl border border-white/20 bg-white/5 p-4 text-center text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                View Full Car Details →
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getListing(id);
  
  if (!data?.listing) {
    return { title: "Listing Not Found" };
  }

  return {
    title: `${data.listing.title} - $${data.listing.price.toLocaleString()} | Cult of Drive Marketplace`,
    description: data.listing.description.slice(0, 160),
  };
}
