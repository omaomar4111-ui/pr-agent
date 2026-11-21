"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Layers,
  Send,
  MessageCircle,
  Bot,
  Settings,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  QrCode
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  isNew?: boolean;
}

export function AppNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on landing page, pricing, login or about, don't show the internal SaaS bar or show public navbar
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/pricing" || pathname === "/about";

  const navItems: NavItem[] = [
    {
      label: "لوحة العمليات",
      href: "/dashboard",
      icon: <LayoutDashboard size={16} />
    },
    {
      label: "صندوق المحادثات",
      href: "/inbox",
      icon: <MessageSquare size={16} />,
      badge: "3"
    },
    {
      label: "مسارات الأتمتة (Flows)",
      href: "/flows",
      icon: <Layers size={16} />,
      isNew: true
    },
    {
      label: "مسار الطلبات (Pipeline)",
      href: "/pipeline",
      icon: <Package size={16} />
    },
    {
      label: "كتالوج الـ AI",
      href: "/catalog",
      icon: <Package size={16} />,
      isNew: true
    },
    {
      label: "رد الكومنتات (DM)",
      href: "/comments",
      icon: <MessageCircle size={16} />,
      isNew: true
    },
    {
      label: "حملات الواتساب",
      href: "/broadcast",
      icon: <Send size={16} />
    },
    {
      label: "أسطول الوكلاء",
      href: "/fleet",
      icon: <Bot size={16} />
    },
    {
      label: "ربط القنوات (QR)",
      href: "/channels",
      icon: <QrCode size={16} />,
      isNew: true
    },
    {
      label: "الإعدادات",
      href: "/settings",
      icon: <Settings size={16} />
    }
  ];

  if (isPublicRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#07040D]/90 backdrop-blur-xl border-b border-white/5 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                PR Agent
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/30 font-mono">
                  PRO
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      isActive
                        ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-purple-500/30 text-purple-300">
                        {item.badge}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions & Store Status */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition"
            >
              معاينة المتجر <ExternalLink size={12} />
            </Link>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">متجر فاشون ستور</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/5 bg-[#0e081c] p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-purple-600/20 text-purple-200 border border-purple-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
