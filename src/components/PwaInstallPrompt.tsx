"use client";

import { useEffect, useState } from "react";
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-2xl bg-[#07040D] border border-[#7C3AED]/40 p-4 shadow-2xl shadow-purple-950/60 font-sans" dir="rtl">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 left-2 text-gray-400 hover:text-white"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#7C3AED]/20">
          <Download className="w-5 h-5 text-[#a78bfa]" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-bold">تثبيت تطبيق PR Agent</p>
          <p className="text-gray-400 text-xs">تابع المحادثات والأوردرات بدون متصفح</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40"
        >
          تثبيت
        </button>
      </div>
    </div>
  );
}
