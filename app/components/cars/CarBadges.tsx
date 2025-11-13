import { Star } from "lucide-react";
import { NewBadge } from "@/app/components/ui/NewBadge";
import { isNew } from "@/utils/date";

interface CarBadgesProps {
  createdAt?: string;
  isFeatured?: boolean;
}

export function CarBadges({ createdAt, isFeatured }: CarBadgesProps) {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-2">
      {createdAt && isNew(createdAt) && <NewBadge />}
      {isFeatured && (
        <div className="flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-xl">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-yellow-400">Featured</span>
        </div>
      )}
    </div>
  );
}
