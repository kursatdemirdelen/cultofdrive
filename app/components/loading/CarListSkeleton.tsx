export function CarListItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-2/3 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="h-4 w-1/3 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="h-4 w-full rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function CarListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CarListItemSkeleton key={i} />
      ))}
    </div>
  );
}
