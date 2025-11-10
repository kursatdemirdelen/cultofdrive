import { Sparkles } from "lucide-react";

export function NewBadge() {
  return (
    <div className="flex items-center gap-1 rounded-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-2 py-1 backdrop-blur-sm">
      <Sparkles className="h-3 w-3 text-green-400" />
      <span className="text-xs font-semibold uppercase tracking-wider text-green-400">New</span>
    </div>
  );
}
