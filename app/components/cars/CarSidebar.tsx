import Link from "next/link";
import { CARD_STYLES } from "@/utils/styles";
import { OwnerLink } from "@/app/components/ui/OwnerLink";

interface CarSidebarProps {
  owner: string;
  driverSlug?: string | null;
  year?: number;
  addedOn?: string | null;
  tags?: string[];
}

export function CarSidebar({ owner, driverSlug, year, addedOn, tags }: CarSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className={CARD_STYLES}>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
          Build Details
        </h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-xs text-white/50">Owner</dt>
            <dd className="mt-1 text-base font-medium text-white">
              <OwnerLink owner={owner} driverSlug={driverSlug} className="hover:text-white/80 transition" />
            </dd>
          </div>
          {year && (
            <div>
              <dt className="text-xs text-white/50">Model Year</dt>
              <dd className="mt-1 text-base font-medium text-white">{year}</dd>
            </div>
          )}
          {addedOn && (
            <div>
              <dt className="text-xs text-white/50">Added</dt>
              <dd className="mt-1 text-base font-medium text-white">{addedOn}</dd>
            </div>
          )}
        </dl>
      </div>

      {tags && tags.length > 0 && (
        <div className={CARD_STYLES}>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <Link
                key={index}
                href={`/garage?tag=${encodeURIComponent(tag)}`}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white/80"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
