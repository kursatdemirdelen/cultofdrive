export function CarCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="aspect-video bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="h-6 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-white/10" />
          <div className="h-6 w-16 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}
