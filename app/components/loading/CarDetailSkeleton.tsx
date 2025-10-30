export function CarDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="mb-6 h-10 w-32 animate-pulse rounded-lg bg-white/10" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="aspect-video w-full bg-white/10" />
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 h-6 w-24 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-3/4 rounded bg-white/10" />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 h-4 w-32 rounded bg-white/10" />
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-full rounded bg-white/10" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
