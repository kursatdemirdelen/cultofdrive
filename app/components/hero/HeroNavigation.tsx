"use client";

import { Camera, Car, Users } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface HeroNavigationProps {
  onNavigate: (id: string) => void;
}

const menuItems: MenuItem[] = [
  { id: "social-feed", label: "Social Feed", icon: Camera },
  { id: "garage", label: "Driver's Garage", icon: Car },
  { id: "community", label: "Join Community", icon: Users },
];

export default function HeroNavigation({ onNavigate }: HeroNavigationProps) {
  return (
    <nav className="mt-8">
      <div className="flex flex-wrap justify-center gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all duration-300 shadow-sm rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 active:scale-95 shadow-black/20"
            >
              <Icon className="w-5 h-5 text-white/80" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
