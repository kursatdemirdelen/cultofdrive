import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
      <div className="mx-auto mb-3 w-fit rounded-full bg-white/5 p-3">
        <Icon className="h-6 w-6 text-white/30" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-white/70">{title}</h3>
      {description && <p className="text-xs text-white/40">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
