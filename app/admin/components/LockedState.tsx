import { Lock } from "lucide-react";

export function LockedState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-12">
      <div className="text-center">
        <Lock className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <h3 className="mb-2 text-lg font-medium text-white/80">
          Admin Access Required
        </h3>
        <p className="text-sm text-white/60">
          Enter your admin key to manage the garage
        </p>
      </div>
    </div>
  );
}
