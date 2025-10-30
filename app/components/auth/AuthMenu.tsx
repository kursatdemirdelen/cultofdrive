"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, PlusCircle, Car, User as UserIcon } from "lucide-react";

interface AuthMenuProps {
  user: User | null;
  onSignOut?: () => Promise<void> | void;
}

export default function AuthMenu({ user, onSignOut }: AuthMenuProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const displayName = useMemo(() => {
    if (!user) return "";
    const metadata =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.username;

    if (metadata && typeof metadata === "string") {
      return metadata;
    }

    if (user.email) {
      return user.email.split("@")[0] ?? user.email;
    }

    return "Driver";
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "";
    const source = displayName || user.email || "";
    const trimmed = source.trim();
    if (!trimmed) return "DR";
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName, user]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (!user) {
      setOpen(false);
      setSigningOut(false);
    }
  }, [user]);

  const handleToggle = () => {
    if (!user) return;
    setOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    if (!onSignOut || signingOut) return;
    try {
      setSigningOut(true);
      await onSignOut();
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {user ? (
        <>
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 backdrop-blur transition hover:bg-white/10"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-white sm:block">
              {displayName}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-white/60 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              <Link
                href="/garage/mine"
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <Car className="h-4 w-4" />
                My Garage
              </Link>
              <Link
                href="/garage/add"
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Car
              </Link>
              <div className="my-2 h-px bg-white/10" />
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-red-400/80 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}
        </>
      ) : (
        <Link
          href="/auth"
          className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
        >
          <UserIcon className="h-4 w-4" />
          Sign in
        </Link>
      )}
    </div>
  );
}
