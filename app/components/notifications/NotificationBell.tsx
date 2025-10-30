"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationBell() {
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      const { count } = await supabaseBrowser
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);
      
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Subscribe to real-time updates
    const channel = supabaseBrowser
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative rounded-lg border border-white/20 bg-white/5 p-2 backdrop-blur transition hover:bg-white/10"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <NotificationPanel
          userId={userId}
          onClose={() => setShowPanel(false)}
          onUpdate={() => setUnreadCount(0)}
        />
      )}
    </div>
  );
}
