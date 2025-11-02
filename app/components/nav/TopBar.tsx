"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import AuthMenu from "@/app/components/auth/AuthMenu";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { NotificationBell } from "@/app/components/notifications/NotificationBell";

export default function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user ?? null);
    });

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  const navLinks = useMemo(() => {
    const base = [
      { href: "/garage", label: "Discover" },
      { href: "/marketplace", label: "Marketplace" },
    ];



    return base;
  }, []);

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
  };

  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg tracking-[0.18em] text-white transition hover:text-white/80"
        >
          CULT OF DRIVE
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname?.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {isAdminPage && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Admin
              </Link>
            )}
          </nav>

          <NotificationBell />
          <AuthMenu user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}
