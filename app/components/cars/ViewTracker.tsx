"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";

type Props = {
  carId: string;
};

export function ViewTracker({ carId }: Props) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        
        await fetch("/api/analytics/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            car_id: carId,
            user_id: user?.id,
          }),
        });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [carId]);

  return null;
}
