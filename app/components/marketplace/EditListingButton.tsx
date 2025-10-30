"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";
import { Edit } from "lucide-react";

type Props = {
  listingId: string;
  sellerId: string;
};

export function EditListingButton({ listingId, sellerId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  if (!userId || userId !== sellerId) {
    return null;
  }

  return (
    <Link
      href={`/marketplace/edit/${listingId}`}
      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
    >
      <Edit className="h-4 w-4" />
      Edit Listing
    </Link>
  );
}
