import Link from "next/link";
import type { ReactNode } from "react";

interface OwnerLinkProps {
  owner: string;
  driverSlug?: string | null;
  className?: string;
  children?: ReactNode;
}

export function OwnerLink({ owner, driverSlug, className = "", children }: OwnerLinkProps) {
  if (driverSlug && driverSlug !== 'anonymous') {
    return (
      <Link href={`/driver/${driverSlug}`} className={className}>
        {children || owner}
      </Link>
    );
  }
  return <span className={className}>{children || owner}</span>;
}
