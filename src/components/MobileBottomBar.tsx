"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Inbox, 
  Workflow, 
  Kanban, 
  BarChart3, 
  Share2, 
  Sparkles,
  Home
} from "lucide-react";
import { soundFX } from "@/lib/soundFX";

export function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/inbox", label: "الرسائل", icon: Inbox, badge: "AI" },
    { href: "/flows", label: "الأتمتة", icon: Workflow },
    { href: "/pipeline", label: "الطلبات", icon: Kanban },
    { href: "/channels", label: "القنوات", icon: Share2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-2.5 bg-gradient-to-t from-[#090710] via-[#0e0a1a]/95 to-transparent backdrop-blur-xl border-t border-purple-500/15">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => soundFX.playPop()}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? "text-emerald-400 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "text-gray-400"} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-[8px] font-mono text-white font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-sans">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
