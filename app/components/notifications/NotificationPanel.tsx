"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { Heart, MessageCircle, X } from "lucide-react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  car_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

type Props = {
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
};

export function NotificationPanel({ userId, onClose, onUpdate }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabaseBrowser
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id: string) => {
    await supabaseBrowser
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    onUpdate();
  };

  const markAllAsRead = async () => {
    await supabaseBrowser
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onUpdate();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "favorite":
        return <Heart className="h-4 w-4 text-red-400" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute right-0 top-full z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-white/60 hover:text-white"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-white/60">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/60">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/cars/${notification.car_id}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    onClose();
                  }}
                  className={`flex gap-3 p-4 transition hover:bg-white/5 ${
                    !notification.read ? "bg-white/5" : ""
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/85">{notification.message}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {new Date(notification.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
