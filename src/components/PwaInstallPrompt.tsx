"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-2xl bg-[#07050d]/90 backdrop-blur-xl border border-[#a855f7]/40 p-4 shadow-2xl shadow-purple-950/80 font-sans" dir="rtl">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 left-2 text-gray-400 hover:text-white p-1 rounded-lg transition"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#8b5cf6]/30 via-[#7c3aed]/20 to-transparent border border-[#a855f7]/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Image
            src="/logo.png"
            alt="PR Agent"
            width={32}
            height={32}
            className="object-contain filter drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
          />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-black tracking-wide">تثبيت تطبيق PR Agent</p>
          <p className="text-gray-300 text-xs">إدارة أوردرات ومحادثات متاجرك بدون متصفح</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-purple-400/30 flex items-center gap-1.5"
        >
          <Download size={14} />
          <span>تثبيت</span>
        </button>
      </div>
    </div>
  );
}
