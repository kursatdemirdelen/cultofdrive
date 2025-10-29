import Image from "next/image";
import CarInteractions from "@/app/components/cars/CarInteractions";
import type { Metadata } from "next";

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

  const owner = car.owner || "Anonymous driver";
  const addedOn = car.created_at ? dateFormatter.format(new Date(car.created_at)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black pb-16">
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-glow">
          <div className="relative h-[340px] w-full sm:h-[420px]">
            {car.imageUrl ? (
              <Image src={car.imageUrl} alt={car.model} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-carbon via-black to-carbon text-white/50">
                Imagery coming soon
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.38em] text-white/60">Driver spotlight</p>
              <h1 className="text-4xl font-heading tracking-[0.16em] text-white md:text-5xl">
                {car.model}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
                {car.year && <span>{car.year}</span>}
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/50" aria-hidden />
                  Owned by {owner}
                </span>
                {addedOn && (
                  <span className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/50" aria-hidden />
                    Added {addedOn}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-[-3.5rem] w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,_2fr)_minmax(240px,_1fr)]">
          <div className="space-y-8">
            <article className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
              <h2 className="text-xl font-semibold text-white">Story</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-white/80">
                {car.description || "No story shared yet."}
              </p>
            </article>

            {car.specs?.length > 0 && (
              <article className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
                <h2 className="text-xl font-semibold text-white">Specifications</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {car.specs.map((spec: string, index: number) => (
                    <li
                      key={`${spec}-${index}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              </article>
            )}

            <CarInteractions carId={id} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
              <h3 className="text-xs uppercase tracking-[0.34em] text-white/50">Build details</h3>
              <dl className="mt-4 space-y-3 text-sm text-white/75">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-white/55">Owner</dt>
                  <dd className="font-medium text-white">{owner}</dd>
                </div>
                {car.year && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/55">Model year</dt>
                    <dd className="font-medium text-white">{car.year}</dd>
                  </div>
                )}
                {addedOn && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/55">Added</dt>
                    <dd className="font-medium text-white">{addedOn}</dd>
                  </div>
                )}
              </dl>
            </div>

            {car.tags?.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
                <h3 className="text-xs uppercase tracking-[0.34em] text-white/50">Tags</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {car.tags.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/75"
                    >
                      #{tag}
                    </span>
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


