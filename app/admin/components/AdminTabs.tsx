"use client";

import { LayoutDashboard, Car, Package, Users, TrendingUp, Shield } from "lucide-react";

type Tab = "dashboard" | "cars" | "marketplace" | "users" | "analytics" | "moderation";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
  { id: "cars" as Tab, label: "Cars", icon: Car },
  { id: "marketplace" as Tab, label: "Marketplace", icon: Package },
  { id: "users" as Tab, label: "Users", icon: Users },
  { id: "analytics" as Tab, label: "Analytics", icon: TrendingUp },
  { id: "moderation" as Tab, label: "Moderation", icon: Shield },
];

export function AdminTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
