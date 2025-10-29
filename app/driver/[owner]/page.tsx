async function getCarsByOwner(owner: string) {
  const res = await fetch(`/api/cars?owner=${encodeURIComponent(owner)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default async function DriverGaragePage({ params }: { params: Promise<{ owner: string }> }) {
  const { owner: rawOwner } = await params;
  const owner = decodeURIComponent(rawOwner);
  const { cars } = await getCarsByOwner(owner);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-heading tracking-[0.1em] text-white md:text-4xl">
            {owner}&apos;s Garage
          </h1>
          <p className="text-white/70">Cars added by this driver</p>
        </header>

        {cars.length === 0 ? (
          <p className="text-white/70">No cars yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: any) => (
              <a
                key={car.id}
                href={`/cars/${car.id}`}
                className="cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-carbon/40 transition-colors hover:bg-carbon/50"
              >
                <div className="relative h-56">
                  {car.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={car.imageUrl} alt={car.model} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-xl font-medium text-white/90">{car.model}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    {car.year && (
                      <>
                        <span>{car.year}</span>
                        <span className="inline-block h-1 w-1 rounded-full bg-white/40" aria-hidden />
                      </>
                    )}
                    <span>{car.owner}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
