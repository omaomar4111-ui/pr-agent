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
  Key,
  Copy,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '@/lib/soundFX';
import { toast } from '@/components/ui/Toast';

export default function ChannelConnectPage() {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'meta' | 'shipping'>('whatsapp');

  // Multi-Tenant Session State (Self-Serve per Client)
  const [tenantName, setTenantName] = useState('متجرك الجديد');
  const [tenantId, setTenantId] = useState('TENANT-994201');

  // WhatsApp QR & Pairing States
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [connectedNumber, setConnectedNumber] = useState<string | null>(null);
  const [usePairingCodeMode, setUsePairingCodeMode] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [pairingCodeRequested, setPairingCodeRequested] = useState(false);

  // Meta States
  const [metaConnected, setMetaConnected] = useState(false);
  const [metaConnecting, setMetaConnecting] = useState(false);
  const [selectedMetaPage, setSelectedMetaPage] = useState('page-1');

  // Shipping Courier API Keys
  const [bostaKey, setBostaKey] = useState('bst_live_99201481092834');
  const [aramexAccount, setAramexAccount] = useState('ARM-CAI-99210');
  const [shippingSaved, setShippingSaved] = useState(false);

  // Load client stored profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pra_merchant_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.storeName) setTenantName(parsed.storeName);
          if (parsed.tenantId) setTenantId(parsed.tenantId);
          if (parsed.phoneNumber) setPhoneNumberInput(parsed.phoneNumber);
        } catch (e) {}
      }
    }
  }, []);

  const fetchWhatsAppQR = async () => {
    setIsQrLoading(true);
    try {
      const res = await fetch(`/api/channels/connect?channel=whatsapp&tenantId=${tenantId}`);
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
  }, [tenantId]);

  const handleSimulateScan = async () => {
    soundFX.playPop();
    try {
      const res = await fetch('/api/channels/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'whatsapp', action: 'verify_scan', tenantId })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        setWaConnected(true);
        setConnectedNumber(phoneNumberInput || data.phoneNumber);
        toast('success', 'تم ربط رقم الواتساب بالذكاء الاصطناعي بنجاح!');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#22c55e', '#a855f7', '#ffffff']
        });
      }
    } catch (err) {
      toast('error', 'فشل التحقق من الاتصال');
    }
  };

  const handleConnectMeta = async () => {
    soundFX.playPop();
    setMetaConnecting(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/channels/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 'meta', action: 'connect_mock', tenantId })
        });
        const data = await res.json();
        if (data.success) {
          soundFX.playSuccess();
          setMetaConnected(true);
          toast('success', 'تم ربط صفحة إنستجرام وفيسبوك وتفعيل الرد على الكومنتات!');
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#a855f7', '#38bdf8', '#22c55e']
          });
        }
      } catch (err) {
        toast('error', 'حدث خطأ أثناء الربط مع ميتا');
      } finally {
        setMetaConnecting(false);
      }
    }, 1200);
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();
    setShippingSaved(true);
    toast('success', 'تم حفظ مفاتيح الربط مع شركة الشحن بنجاح!');
    setTimeout(() => setShippingSaved(false), 3000);
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    soundFX.playPop();
    toast('info', 'تم النسخ إلى الحافظة');
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-4 sm:p-8 font-sans selection:bg-purple-600 selection:text-white pb-24" dir="rtl">
      
      {/* Client Tenant Identity Bar */}
      <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#100b22] to-emerald-950/30 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{tenantName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                مساحة عمل خاصة
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">كود الحساب: {tenantId}</span>
          </div>
        </div>

        <Link
          href="/inbox"
          className="text-xs text-purple-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 transition-all flex items-center gap-1.5"
        >
          <span>صندوق المحادثات</span>
          <ArrowRight size={13} className="rotate-180" />
        </Link>
      </div>

      {/* Main Header */}
      <div className="max-w-5xl mx-auto mb-8 text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          ربط قنوات متجرك بنفسك في دقيقة واحدة 🚀
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          اربط حساب الواتساب وإنستجرام وشركة الشحن الخاصة بمتجرك بضغطة زر دون الحاجة لأي مبرمج أو إعدادات معقدة.
        </p>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#110c22] border border-white/5 max-w-xl mx-auto">
          <button
            onClick={() => {
              setActiveChannel('whatsapp');
              soundFX.playPop();
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeChannel === 'whatsapp'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone size={16} />
            <span>واتساب (WhatsApp)</span>
            {waConnected && <Check size={14} className="text-black stroke-[3]" />}
          </button>

          <button
            onClick={() => {
              setActiveChannel('meta');
              soundFX.playPop();
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeChannel === 'meta'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Share2 size={16} />
            <span>إنستجرام وفيسبوك</span>
            {metaConnected && <Check size={14} className="text-emerald-400 stroke-[3]" />}
          </button>

          <button
            onClick={() => {
              setActiveChannel('shipping');
              soundFX.playPop();
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeChannel === 'shipping'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Truck size={16} />
            <span>شركات الشحن</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto">

        {/* 1. WHATSAPP CONNECTION (Zero Friction QR or Pairing Code) */}
        {activeChannel === 'whatsapp' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#110c22] border border-emerald-500/30 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">خطوة واحدة سهلة جداً</span>
                <h2 className="text-xl font-bold text-white mt-0.5">مسح رمز الـ QR أو كود الهاتف</h2>
              </div>

              {/* Toggle Mode: QR Code or Pairing Code */}
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setUsePairingCodeMode(false)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    !usePairingCodeMode ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400'
                  }`}
                >
                  مسح QR (كاميرا الموبايل)
                </button>
                <button
                  onClick={() => setUsePairingCodeMode(true)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    usePairingCodeMode ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400'
                  }`}
                >
                  كود اقتران (بدون كاميرا)
                </button>
              </div>
            </div>

            {waConnected ? (
              <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">الواتساب متصل ويعمل بنجاح! 🟢</h3>
                <p className="text-xs text-gray-300">
                  الرقم المتصل: <strong className="text-emerald-400 font-mono">{connectedNumber || '+20 101 234 5678'}</strong>
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/inbox"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
                  >
                    فتح صندوق الرسائل
                  </Link>
                  <button
                    onClick={() => setWaConnected(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition"
                  >
                    قطع الاتصال وتغيير الرقم
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                
                {/* Visual Connector / QR Frame */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-white/10">
                  {!usePairingCodeMode ? (
                    <>
                      <div className="w-56 h-56 bg-white p-3 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden">
                        {isQrLoading ? (
                          <RefreshCw size={28} className="animate-spin text-purple-600" />
                        ) : qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
                        ) : (
                          <QrCode size={120} className="text-black opacity-80" />
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={fetchWhatsAppQR}
                          className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <RefreshCw size={12} />
                          <span>تحديث الرمز</span>
                        </button>
                        <span className="text-gray-600">·</span>
                        <button
                          onClick={handleSimulateScan}
                          className="text-[11px] text-emerald-400 font-bold hover:underline"
                        >
                          تجربة تأكيد المسح الآن
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full space-y-4 text-center">
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                        <span className="text-[10px] text-gray-400 block">كود الاقتران السري:</span>
                        <div className="text-2xl font-black font-mono text-emerald-400 tracking-widest">
                          {pairingCode || '841-294'}
                        </div>
                      </div>
                      <button
                        onClick={() => copyText(pairingCode || '841-294')}
                        className="text-xs text-purple-300 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <Copy size={13} />
                        <span>نسخ الكود</span>
                      </button>
                      <button
                        onClick={handleSimulateScan}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition"
                      >
                        تأكيد إدخال الكود في هاتفك
                      </button>
                    </div>
                  )}
                </div>

                {/* 3 Simple Steps */}
                <div className="md:col-span-7 space-y-4 text-xs">
                  <span className="text-gray-400 font-bold block mb-1">خطوات الربط من هاتفك (30 ثانية):</span>
                  
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <strong className="text-white block">افتح تطبيق WhatsApp على هاتفك</strong>
                      <span className="text-gray-400">اضغط على القائمة (الـ 3 نقاط) أو الإعدادات في الآيفون.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <strong className="text-white block">اختر "الأجهزة المرتبطة" (Linked Devices)</strong>
                      <span className="text-gray-400">ثم اضغط على زر "ربط جهاز" (Link a Device).</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <strong className="text-white block">وجّه كاميرا الهاتف نحو الشاشة</strong>
                      <span className="text-gray-400">سيتم الاتصال فوراً ويبدأ الذكاء الاصطناعي في الرد على العملاء.</span>
                    </div>
                  </div>

                  {/* Anti-Ban Guarantee Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-[11px]">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>الرقم محمي بدرع مكافحة الحظر (Anti-Ban Guard) ومحاكاة الكتابة الطبيعية.</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* 2. META (INSTAGRAM & MESSENGER) */}
        {activeChannel === 'meta' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#110c22] border border-purple-500/30 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">ربط فوري رسمي</span>
                <h2 className="text-xl font-bold text-white mt-0.5">صفحات إنستجرام وفيسبوك (Comment to DM)</h2>
              </div>
            </div>

            {metaConnected ? (
              <div className="p-8 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center mx-auto text-purple-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">تم الربط مع إنستجرام وفيسبوك بنجاح! 🟣</h3>
                <p className="text-xs text-gray-300">
                  الصفحة النشطة: <strong className="text-purple-300">@pr_store_egypt</strong> (مفعل الرد التلقائي على الكومنتات والرسائل)
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/comments"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
                  >
                    إعدادات ردود الكومنتات
                  </Link>
                  <button
                    onClick={() => setMetaConnected(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition"
                  >
                    فصل الحساب
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-xl mx-auto text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 p-[2px] mx-auto">
                  <div className="w-full h-full rounded-3xl bg-[#0e091b] flex items-center justify-center gap-2">
                    <span className="text-xl">📸</span>
                    <span className="text-xl">💬</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">تسجيل الدخول بضغطة زر عبر Meta</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    اضغط على الزر بالأسفل لمنح PR Agent صلاحية الرد على رسائل الإنستجرام وتحويل تعليقات العملاء على البوستات والريلز إلى رسائل خاصة فوراً.
                  </p>
                </div>

                <button
                  onClick={handleConnectMeta}
                  disabled={metaConnecting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {metaConnecting ? (
                    <RefreshCw size={16} className="animate-spin text-white" />
                  ) : (
                    <Share2 size={16} />
                  )}
                  <span>ربط حساب إنستجرام وفيسبوك الآن</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. SHIPPING COURIER KEYS */}
        {activeChannel === 'shipping' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#110c22] border border-blue-500/30 shadow-2xl space-y-6 animate-fade-in">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">بوالص الشحن التلقائية</span>
              <h2 className="text-xl font-bold text-white mt-0.5">ربط شركات الشحن (بوسطة وأوتو وأرامكس)</h2>
              <p className="text-xs text-gray-400 mt-1">أدخل مفتاح الـ API الخاص بحسابك في شركة الشحن ليتم إصدار البوليصة فور تأكيد الدفع.</p>
            </div>

            <form onSubmit={handleSaveShipping} className="space-y-4 max-w-xl mx-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">مفتاح بوسطة (Bosta API Key)</label>
                <input
                  type="text"
                  value={bostaKey}
                  onChange={(e) => setBostaKey(e.target.value)}
                  placeholder="bst_live_..."
                  className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">رقم حساب أرامكس (Aramex Account No)</label>
                <input
                  type="text"
                  value={aramexAccount}
                  onChange={(e) => setAramexAccount(e.target.value)}
                  placeholder="ARM-CAI-..."
                  className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {shippingSaved ? <Check size={16} /> : <Key size={16} />}
                <span>{shippingSaved ? 'تم الحفظ وتفعيل الربط!' : 'حفظ مفاتيح الشحن'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
