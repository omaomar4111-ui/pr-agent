"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function AnimatedTabs({ tabs, activeTab, onChange, className }: AnimatedTabsProps) {
  return (
    <div className={cn("flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 flex items-center gap-2 outline-none select-none",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/40 to-indigo-600/30 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-mono",
                  isActive ? "bg-purple-500/30 text-purple-200" : "bg-white/5 text-slate-400"
                )}>
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
