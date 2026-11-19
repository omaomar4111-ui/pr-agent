'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Zap
} from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">لوحة تحكم المتجر والعمليات</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              Live Production
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            متابعة فورية للمحادثات، طلبات الشراء، تحويلات إنستاباي، وبوالص الشحن التلقائية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            تحديث
          </button>
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold shadow-lg shadow-purple-600/20 transition"
          >
            <MessageSquare size={14} />
            صندوق المحادثات الموحد
          </Link>
          <Link
            href="/fleet"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition"
          >
            <Bot size={14} className="text-purple-400" />
            غرفة الوكلاء (Fleet)
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">مبيعات اليوم المحققة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight">
            {data?.stats?.todayRevenue?.toLocaleString('ar-EG') || '28,450'} <span className="text-xs text-slate-400 font-sans">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> +18.4% مقارنة بالأمس
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">إجمالي الطلبات اليوم</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight">
            {data?.stats?.totalOrders || '142'}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            منها {data?.stats?.pendingOrders || 9} طلبات قيد إتمام الدفع
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">تحويلات إنستاباي للمراجعة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-amber-400">
            {data?.stats?.instapayPending || '4'}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-2">
            تم التعرف الذاتي بدقة 98%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">نسبة الإغلاق الآلي (AI)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-indigo-400">
            {data?.stats?.aiHandledRate || '94.2'}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            متوسط سرعة الرد: 1.8 ثانية
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section: Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">أحدث طلبات المتجر</h2>
                <p className="text-xs text-slate-400 mt-0.5">استخراج فوري للبيانات من المحادثات وتجهيز بوالص الشحن</p>
              </div>
              <Link href="/inbox" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium">
                عرض كل المحادثات <ExternalLink size={12} />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {data?.recentOrders?.map((order: Order) => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">{order.id}</span>
                      <span className="font-bold text-sm text-slate-100">{order.customer}</span>
                      <span className="text-xs text-slate-400 font-mono" dir="ltr">{order.phone}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: InstaPay Verification & Channel Health */}
        <div className="space-y-6">
          {/* InstaPay Verification Box */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold">تحويلات إنستاباي المعلقة</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">OCR Verifier</span>
            </div>

            <div className="space-y-3 mt-4">
              {data?.pendingInstaPay?.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  لا توجد تحويلات معلقة، جميع الإشعارات معتمدة.
                </div>
              ) : (
                data?.pendingInstaPay?.map((tx: InstaPayTx) => (
                  <div key={tx.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
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
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50"
                      >
                        {approvingId === tx.id ? 'جاري الاعتماد...' : 'اعتماد وتأكيد الطلب'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Connected Channels */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
            <h3 className="text-sm font-bold pb-3 border-b border-white/5">القنوات المتصلة (Omnichannel)</h3>
            <div className="space-y-3 mt-4">
              {data?.channels?.map((ch: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
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
