export function MarketplaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="relative aspect-video overflow-hidden bg-white/10">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="h-4 w-1/2 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-3 w-12 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <MarketplaceCardSkeleton key={i} />
      ))}
    </div>
  );
}
