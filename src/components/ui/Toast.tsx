'use client';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface ToastData { id: string; type: ToastType; message: string; }

let toastFn: ((t: ToastType, m: string) => void) | null = null;
export const toast = (type: ToastType, message: string) => toastFn?.(type, message);

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastFn = (type, message) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
    };
  }, []);

  const icons = { success: CheckCircle2, error: XCircle, info: Info };
  const colors = {
    success: 'border-green-500/30 bg-green-500/10 text-green-400',
    error: 'border-red-500/30 bg-red-500/10 text-red-400',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 font-sans" dir="rtl">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl animate-slide-up shadow-2xl ${colors[t.type]}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{t.message}</span>
            <button 
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="p-1 hover:bg-white/10 rounded-md transition"
            >
              <X className="w-4 h-4 opacity-60" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
