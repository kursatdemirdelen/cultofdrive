export default function LoadingState() {
  return (
    <section className="px-12 py-16 bg-gradient-to-b from-gray-900 to-black/90">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-48 rounded bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
          <div className="mx-auto h-5 w-64 rounded bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="relative aspect-square overflow-hidden bg-white/10">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
                <div className="h-3 w-1/2 rounded bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
