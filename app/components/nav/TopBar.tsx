"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import AuthMenu from "@/app/components/auth/AuthMenu";
import { supabaseBrowser } from "@/utils/supabase-browser";

const linkBase =
  "rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.28em] transition";

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
      { href: "/garage", label: "Garage" },
      { href: "/feed", label: "Social Feed" },
    ];

    if (user) {
      base.splice(1, 0, { href: "/garage/mine", label: "My Garage" });
    }

    return base;
  }, [user]);

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="flex items-center justify-between h-16 max-w-6xl px-4 mx-auto sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg tracking-[0.18em] text-white transition hover:text-white/80"
        >
          CULT OF DRIVE
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 text-[11px] text-white/70 sm:text-xs">
            {navLinks.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${linkBase} ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <AuthMenu user={user} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}
