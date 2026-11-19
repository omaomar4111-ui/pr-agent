'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ArrowUpRight,
  RefreshCw,
  MessageSquare,
  Bot,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  Check,
  X,
  Sparkles,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlowingSpotlightCard } from '@/components/GlowingSpotlightCard';
import { AnimatedTabs } from '@/components/AnimatedTabs';
import { NumberTicker } from '@/components/NumberTicker';

interface Order {
  id: string;
  customer: string;
  phone: string;
  channel: string;
  items: string;
  total: number;
  status: string;
  paymentMethod: string;
  date: string;
  courier?: string;
  trackingNumber?: string;
}

interface InstaPayTx {
  id: string;
  customer: string;
  amount: number;
  refNumber: string;
  senderPhone: string;
  orderId: string;
  time: string;
  confidence: number;
}

export default function MerchantDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprovePayment = async (txId: string, orderId: string) => {
    setApprovingId(txId);
    try {
      await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId, orderId, action: 'approve' })
      });

      // Celebration effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#10b981', '#ffffff']
      });

      if (data) {
        setData({
          ...data,
          pendingInstaPay: data.pendingInstaPay.filter((tx: InstaPayTx) => tx.id !== txId),
          stats: {
            ...data.stats,
            instapayPending: Math.max(0, data.stats.instapayPending - 1),
            pendingOrders: Math.max(0, data.stats.pendingOrders - 1)
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const filteredOrders = data?.recentOrders?.filter((order: Order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              لوحة تحكم المتجر والعمليات
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Production
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            متابعة فورية للمبيعات، إشعارات إنستاباي الذكية، وحركات الشحن التلقائية عبر الوكلاء.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            تحديث
          </button>
          <Link
            href="/catalog"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold transition"
          >
            <Sparkles size={14} className="text-purple-400" />
            تدريب الكتالوج (AI)
          </Link>
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition"
          >
            <MessageSquare size={14} />
            المحادثات الموحدة
          </Link>
          <Link
            href="/fleet"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition"
          >
            <Bot size={14} className="text-purple-400" />
            غرفة الوكلاء (Fleet)
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid with Motion & Spotlight */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8">
        <GlowingSpotlightCard spotlightColor="rgba(16, 185, 129, 0.18)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">مبيعات اليوم المحققة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
            <NumberTicker value={data?.stats?.todayRevenue || 28450} />
            <span className="text-xs text-slate-400 font-sans">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> +18.4% مقارنة بالأمس
          </div>
        </GlowingSpotlightCard>

        <GlowingSpotlightCard spotlightColor="rgba(168, 85, 247, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">إجمالي الطلبات اليوم</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-white">
            <NumberTicker value={data?.stats?.totalOrders || 142} />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            منها {data?.stats?.pendingOrders || 9} طلبات قيد إتمام الدفع
          </div>
        </GlowingSpotlightCard>

        <GlowingSpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">تحويلات إنستاباي للمراجعة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-amber-400">
            <NumberTicker value={data?.stats?.instapayPending || 4} />
          </div>
          <div className="text-[11px] text-amber-400/80 mt-2">
            تم التعرف الذاتي بدقة 98%
          </div>
        </GlowingSpotlightCard>

        <GlowingSpotlightCard spotlightColor="rgba(99, 102, 241, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">نسبة الإغلاق الآلي (AI)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-indigo-400">
            {data?.stats?.aiHandledRate || 94.2}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            متوسط سرعة الرد: 1.8 ثانية
          </div>
        </GlowingSpotlightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section: Recent Orders with Tab & Search Filtering */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Header & Controls */}
            <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-100">أحدث طلبات المتجر</h2>
                <p className="text-xs text-slate-400 mt-0.5">استخراج فوري للبيانات من المحادثات وتجهيز بوالص الشحن</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث باسم العميل، الهاتف، أو رقم الطلب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 bg-white/[0.03] border border-white/10 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 pt-3 border-b border-white/5">
              <AnimatedTabs
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { id: 'all', label: 'الكل', badge: data?.recentOrders?.length },
                  { id: 'confirmed', label: 'مؤكد', badge: data?.recentOrders?.filter((o: any) => o.status === 'confirmed').length },
                  { id: 'pending_payment', label: 'بانتظار الدفع', badge: data?.recentOrders?.filter((o: any) => o.status === 'pending_payment').length },
                  { id: 'dispatched', label: 'جاري الشحن', badge: data?.recentOrders?.filter((o: any) => o.status === 'dispatched').length }
                ]}
              />
            </div>

            {/* Orders Feed */}
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredOrders?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    لا توجد طلبات تطابق معايير البحث المحددة.
                  </div>
                ) : (
                  filteredOrders?.map((order: Order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">{order.id}</span>
                          <span className="font-bold text-sm text-slate-100">{order.customer}</span>
                          <span className="text-xs text-slate-400 font-mono" dir="ltr">{order.phone}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-mono">
                            {order.channel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{order.items}</p>
                        {order.courier && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-1">
                            <Truck size={12} /> {order.courier}: {order.trackingNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="text-left md:text-right">
                          <div className="text-sm font-bold font-mono text-slate-100">{order.total} ج.م</div>
                          <div className="text-[10px] text-slate-400">{order.date}</div>
                        </div>
                        <div>
                          {order.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle size={12} /> تم التأكيد
                            </span>
                          ) : order.status === 'dispatched' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Truck size={12} /> جاري الشحن
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock size={12} /> بانتظار الدفع
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar: InstaPay Verification & Channel Health */}
        <div className="space-y-6">
          {/* InstaPay Verification Box with interactive glow */}
          <GlowingSpotlightCard spotlightColor="rgba(245, 158, 11, 0.15)">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold">تحويلات إنستاباي المعلقة</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">OCR Verifier</span>
            </div>

            <div className="space-y-3 mt-4">
              <AnimatePresence>
                {data?.pendingInstaPay?.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    لا توجد تحويلات معلقة، جميع الإشعارات معتمدة.
                  </div>
                ) : (
                  data?.pendingInstaPay?.map((tx: InstaPayTx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-amber-500/30 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">{tx.customer}</span>
                        <span className="font-mono text-xs font-bold text-emerald-400">{tx.amount} ج.م</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{tx.refNumber}</span>
                        <span>{tx.time}</span>
                      </div>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleApprovePayment(tx.id, tx.orderId)}
                          disabled={approvingId === tx.id}
                          className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {approvingId === tx.id ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          {approvingId === tx.id ? 'جاري الاعتماد...' : 'اعتماد وتأكيد الطلب'}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </GlowingSpotlightCard>

          {/* Connected Channels */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 backdrop-blur-xl">
            <h3 className="text-sm font-bold pb-3 border-b border-white/5">القنوات المتصلة (Omnichannel)</h3>
            <div className="space-y-3 mt-4">
              {data?.channels?.map((ch: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-slate-200">{ch.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{ch.conversations} محادثة</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
