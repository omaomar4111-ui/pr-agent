"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Layers,
  Package,
  MessageCircle,
  Send,
  Bot,
  Settings,
  X
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4 font-sans" dir="rtl">
      <div className="w-full max-w-xl bg-[#0e081c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
        <Command className="w-full" label="شريط الأوامر السريعة">
          <div className="flex items-center px-4 border-b border-white/10">
            <Search size={16} className="text-slate-400 ml-2" />
            <Command.Input
              placeholder="ابحث عن صفحة، إعداد، أو إجراء سريع... (Ctrl+K)"
              className="w-full bg-transparent py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2 text-xs space-y-1">
            <Command.Empty className="p-4 text-center text-slate-500">لا توجد نتائج مطابقة.</Command.Empty>

            <Command.Group heading="التنقل السريع" className="text-[10px] text-slate-500 px-2 py-1 font-mono">
              <Command.Item
                onSelect={() => navigateTo("/dashboard")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <LayoutDashboard size={14} className="text-purple-400" />
                <span>لوحة العمليات والمبيعات</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/inbox")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <MessageSquare size={14} className="text-purple-400" />
                <span>صندوق المحادثات الموحد (Omnichannel Inbox)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/pipeline")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <Layers size={14} className="text-purple-400" />
                <span>مسار خط الطلبات والشحن (Pipeline)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/catalog")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <Package size={14} className="text-purple-400" />
                <span>كتالوج وتدريب الذكاء الاصطناعي</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/comments")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <MessageCircle size={14} className="text-purple-400" />
                <span>رد الكومنتات وإرسال الرسائل الخاصة (Comment-to-DM)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/broadcast")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <Send size={14} className="text-purple-400" />
                <span>حملات استرجاع السلات المتروكة (Broadcast)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/fleet")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <Bot size={14} className="text-purple-400" />
                <span>غرفة أسطول الوكلاء (OpenMausBot Fleet)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/settings")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                <Settings size={14} className="text-purple-400" />
                <span>إعدادات المتجر وفريق العمل</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
