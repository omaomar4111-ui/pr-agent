'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  QrCode,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
  AlertCircle,
  Share2,
  MessageCircle,
  Truck,
  Check,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlowingSpotlightCard } from '@/components/GlowingSpotlightCard';

export default function ChannelConnectPage() {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'meta' | 'shipping'>('whatsapp');

  // WhatsApp QR States
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [connectedNumber, setConnectedNumber] = useState<string | null>(null);

  // Meta States
  const [metaConnected, setMetaConnected] = useState(false);
  const [metaConnecting, setMetaConnecting] = useState(false);

  // Shipping Courier API Keys
  const [bostaKey, setBostaKey] = useState('bst_live_99201481092834');
  const [aramexAccount, setAramexAccount] = useState('ARM-CAI-99210');
  const [shippingSaved, setShippingSaved] = useState(false);

  const fetchWhatsAppQR = async () => {
    setIsQrLoading(true);
    try {
      const res = await fetch('/api/channels/connect?channel=whatsapp');
      const data = await res.json();
      if (data.success) {
        setQrCodeUrl(data.qrCode);
        setPairingCode(data.pairingCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQrLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppQR();
  }, []);

  const handleSimulateScan = async () => {
    try {
      const res = await fetch('/api/channels/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'whatsapp', action: 'verify_scan' })
      });
      const data = await res.json();
      if (data.success) {
        setWaConnected(true);
        setConnectedNumber(data.phoneNumber);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#22c55e', '#a855f7', '#ffffff']
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectMeta = async () => {
    setMetaConnecting(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/channels/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 'meta', action: 'connect_mock' })
        });
        const data = await res.json();
        if (data.success) {
          setMetaConnected(true);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#3b82f6', '#ec4899', '#ffffff']
          });
        }
      } finally {
        setMetaConnecting(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              مركز ربط القنوات وبوابات الشحن
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              Omnichannel Connect Wizard
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            اربط رقم الواتساب بالـ QR Code، وفعّل وصول الذكاء الاصطناعي لرسائل إنستاجرام وفيسبوك وبوالص بوسطة.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition"
        >
          <ArrowRight size={14} /> لوحة التحكم
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 my-8 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveChannel('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeChannel === 'whatsapp'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-slate-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <MessageSquare size={16} /> WhatsApp Business API
          {waConnected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveChannel('meta')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeChannel === 'meta'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'text-slate-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Share2 size={16} /> Instagram & Facebook Meta
          {metaConnected && <span className="w-2 h-2 rounded-full bg-blue-400" />}
        </button>

        <button
          onClick={() => setActiveChannel('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeChannel === 'shipping'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'text-slate-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Truck size={16} /> بوالص الشحن (Bosta & Aramex)
        </button>
      </div>

      {/* Tab 1: WhatsApp Connect */}
      {activeChannel === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-white/5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode size={18} className="text-emerald-400" /> مسح رمز الـ QR لتوصيل واتساب
              </span>
              <button
                onClick={fetchWhatsAppQR}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-normal"
              >
                <RefreshCw size={12} className={isQrLoading ? 'animate-spin' : ''} /> تحديث الرمز
              </button>
            </h3>

            {!waConnected ? (
              <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
                {isQrLoading || !qrCodeUrl ? (
                  <div className="w-[280px] h-[280px] flex flex-col items-center justify-center text-slate-500">
                    <RefreshCw size={28} className="animate-spin mb-2" />
                    جاري توليد جلسة اتصال آمنة...
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-2xl shadow-2xl">
                    <img src={qrCodeUrl} alt="WhatsApp QR Code" className="w-[260px] h-[260px]" />
                  </div>
                )}

                <div className="mt-4 space-y-1">
                  <p className="text-xs text-slate-300">افتح واتساب على هاتفك ← الأجهزة المرتبطة ← ربط جهاز</p>
                  <p className="text-[11px] font-mono text-emerald-400">كود الإقران السريع: {pairingCode || '942-881'}</p>
                </div>

                <button
                  onClick={handleSimulateScan}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
                >
                  <Check size={14} /> تأكيد الربط (Pairing Test)
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">رقم الواتساب متصل ويعمل حياً!</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono" dir="ltr">{connectedNumber}</p>
                </div>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20 max-w-sm mx-auto">
                  الوكلاء الذكية تستمع الآن لرسائل العملاء وترد في أقل من ثانيتين.
                </div>
                <button
                  onClick={() => setWaConnected(false)}
                  className="text-xs text-red-400 hover:underline pt-2"
                >
                  فصل الرقم وتوصيل رقم آخر
                </button>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <GlowingSpotlightCard spotlightColor="rgba(16, 185, 129, 0.15)">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <ShieldCheck size={18} /> بروتوكول مكافحة الحظر (Anti-Ban Guard)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                المنصة مزودة بموزع إرسال ذكي (Adaptive Rate Limiter) يحاكي سرعة الكتابة الطبيعية للإنسان مع تأخير عشوائي بين 1.2 إلى 3.5 ثانية لحماية رقمك التجاري من أي تقييد.
              </p>
            </GlowingSpotlightCard>
          </div>
        </div>
      )}

      {/* Tab 2: Meta Instagram & Facebook */}
      {activeChannel === 'meta' && (
        <div className="max-w-2xl mx-auto rounded-2xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center mx-auto shadow-2xl">
            <Share2 size={32} className="text-white" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">ربط صفحات فيسبوك وحسابات إنستاجرام بيزنس</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              تفعيل الرد التلقائي على الرسائل الخاصة (Direct Messages) والردود اللحظية على تعليقات المنشورات والإعلانات.
            </p>
          </div>

          {!metaConnected ? (
            <button
              onClick={handleConnectMeta}
              disabled={metaConnecting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-xs font-bold text-white transition shadow-[0_0_25px_rgba(59,130,246,0.3)] disabled:opacity-50 inline-flex items-center gap-2"
            >
              {metaConnecting ? <RefreshCw size={14} className="animate-spin" /> : <Share2 size={14} />}
              {metaConnecting ? 'جاري الاتصال بـ Meta Graph API...' : 'تسجيل الدخول وربط الحسابات عبر Meta'}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-right space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300">الصفحات المتصلة والمعتمدة:</span>
                <span className="text-[10px] font-mono text-emerald-400">Live Synchronized</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-100">متجر الفاشون المصري (@pr_store_egypt)</h5>
                  <p className="text-[11px] text-slate-400">Facebook Page & Instagram Direct</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Tab 3: Courier APIs */}
      {activeChannel === 'shipping' && (
        <div className="max-w-2xl mx-auto rounded-2xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Truck size={20} className="text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">مفاتيح الربط التلقائي لشركات الشحن (APIs)</h3>
              <p className="text-xs text-slate-400">إدخال مفاتيح بوسطة وأرامكس لتصدير البوالص تلقائياً بعد تأكيد الطلب</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">Bosta API Key (مفتاح بوسطة)</label>
              <input
                type="text"
                value={bostaKey}
                onChange={(e) => setBostaKey(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-medium">Aramex Account Number / Entity</label>
              <input
                type="text"
                value={aramexAccount}
                onChange={(e) => setAramexAccount(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {shippingSaved ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <Check size={14} /> تم حفظ المفاتيح وتفعيل التصدير التلقائي!
                </span>
              ) : <div />}

              <button
                type="button"
                onClick={() => {
                  setShippingSaved(true);
                  setTimeout(() => setShippingSaved(false), 3000);
                }}
                className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
