"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, PlusCircle, SquareUser } from "lucide-react";

interface AuthMenuProps {
  user: User | null;
  onSignOut?: () => Promise<void> | void;
}

const buttonBase =
  "inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

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

  const subtitle = useMemo(() => {
    if (!user) return "";
    const company = user.user_metadata?.team || user.user_metadata?.company;
    return company && typeof company === "string" ? company : user.email ?? "";
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
            className={`${buttonBase} pl-2 pr-3`}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-sm font-semibold text-white">
              {initials}
            </span>
            <span className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-sm font-medium text-white">{displayName}</span>
              {subtitle && <span className="text-xs text-white/55">{subtitle}</span>}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/60 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-black/85 p-2 text-sm text-white/80 shadow-glow backdrop-blur"
            >
              <Link
                href="/garage/mine"
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <SquareUser className="h-4 w-4 text-white/60" />
                My garage
              </Link>
              <Link
                href="/garage/add"
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <PlusCircle className="h-4 w-4 text-white/60" />
                Share a build
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4 text-white/60" />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}
        </>
      ) : (
        <Link
          href="/auth"
          className={`${buttonBase} px-4 uppercase tracking-[0.24em]`}
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
