import { Calendar, User } from "lucide-react";
import { OwnerLink } from "@/app/components/ui/OwnerLink";

interface CarMetadataProps {
  year?: number;
  owner: string;
  driverSlug?: string | null;
  viewCount?: number;
  addedOn?: string | null;
}

export function CarMetadata({ year, owner, driverSlug, viewCount, addedOn }: CarMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
      {year && (
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {year}
        </span>
      )}
      <span className="text-white/30">•</span>
      <OwnerLink owner={owner} driverSlug={driverSlug} className="flex items-center gap-1.5 hover:text-white transition">
        <User className="h-3.5 w-3.5" />
        {owner}
      </OwnerLink>
      {viewCount && viewCount > 0 && (
        <>
          <span className="text-white/30">•</span>
          <span>{viewCount} views</span>
        </>
      )}
      {addedOn && (
        <>
          <span className="text-white/30">•</span>
          <span>{addedOn}</span>
        </>
      )}
    </div>
  );
}
