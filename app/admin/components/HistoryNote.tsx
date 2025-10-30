import { Info } from "lucide-react";

export function HistoryNote() {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
      <div className="flex gap-3">
        <Info className="h-5 w-5 flex-shrink-0 text-blue-400" />
        <div className="text-sm text-white/70">
          <p className="font-medium text-white/90">Admin Key Storage</p>
          <p className="mt-1">
            Your admin key is stored locally in your browser for convenience. Clear it from localStorage to disconnect.
          </p>
        </div>
      </div>
    </div>
  );
}
