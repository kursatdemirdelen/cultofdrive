export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white" />
        </div>
        <p className="font-heading text-lg tracking-[0.12em] text-white/60">
          LOADING
        </p>
      </div>
    </div>
  );
}
