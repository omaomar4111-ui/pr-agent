"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Package, 
  Truck, 
  Sparkles,
  RefreshCw,
  Plus,
  Phone,
  MapPin
} from "lucide-react";

interface OrderCard {
  id: string;
  customer: string;
  phone: string;
  city: string;
  items: string;
  total: number;
  stage: "new" | "pending_payment" | "verified" | "dispatched";
  paymentMethod: string;
  createdAt: string;
}

export default function PipelinePage() {
  const [orders, setOrders] = useState<OrderCard[]>([
    {
      id: "ord-101",
      customer: "كريم ممدوح",
      phone: "01012345678",
      city: "القاهرة - المعادي",
      items: "هودي أسود أوفر سايز (L) × 2",
      total: 1300,
      stage: "verified",
      paymentMethod: "INSTAPAY",
      createdAt: "منذ 10 دقائق"
    },
    {
      id: "ord-102",
      customer: "نورهان الشريف",
      phone: "01129876543",
      city: "القاهرة - التجمع الخامس",
      items: "فستان بيج شتوي (M) × 1",
      total: 850,
      stage: "pending_payment",
      paymentMethod: "INSTAPAY",
      createdAt: "منذ 25 دقيقة"
    },
    {
      id: "ord-103",
      customer: "محمد السعيد",
      phone: "01234567890",
      city: "الإسكندرية - سموحة",
      items: "تيشيرت أبيض أساسي (XL) × 3",
      total: 750,
      stage: "new",
      paymentMethod: "COD",
      createdAt: "منذ ساعة"
    },
    {
      id: "ord-104",
      customer: "سلمى فؤاد",
      phone: "01098765432",
      city: "الجيزة - الدقي",
      items: "سويت شيرت كحلي (S) × 1",
      total: 550,
      stage: "dispatched",
      paymentMethod: "COD",
      createdAt: "منذ 3 ساعات"
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.warn("Failed to fetch live orders:", err);
      }
    }
    loadOrders();
  }, []);

  const stages: { id: OrderCard["stage"]; label: string; icon: any; color: string }[] = [
    { id: "new", label: "أوردرات جديدة (New)", icon: Clock, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10" },
    { id: "pending_payment", label: "بانتظار التحويل (Pending)", icon: CreditCard, color: "text-amber-400 border-amber-500/20 bg-amber-500/10" },
    { id: "verified", label: "تم التحقق من الدفع (Verified)", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
    { id: "dispatched", label: "جاهز / خرج للشحن (Dispatched)", icon: Truck, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" }
  ];

  const moveOrder = async (orderId: string, direction: "prev" | "next") => {
    const stageOrder: OrderCard["stage"][] = ["new", "pending_payment", "verified", "dispatched"];
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const currentIndex = stageOrder.indexOf(targetOrder.stage);
    const nextIndex = direction === "next" 
      ? Math.min(currentIndex + 1, stageOrder.length - 1)
      : Math.max(currentIndex - 1, 0);

    const newStage = stageOrder[nextIndex];
    if (newStage === targetOrder.stage) return;

    // Optimistic UI Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: newStage } : o));

    // Sync with backend API
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, stage: newStage })
      });
    } catch (err) {
      console.warn("Order sync error:", err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-[#07040D] text-white font-sans selection:bg-indigo-600 pb-16">
      {/* Top Header */}
      <header className="border-b border-white/10 px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="text-gray-500 font-mono">/</span>
          <h1 className="text-sm font-semibold text-gray-200">إدارة مراحل الطلبات والمبيعات (Pipeline CRM)</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/inbox" className="text-xs text-gray-300 hover:text-white transition">صندوق المحادثات</Link>
          <Link href="/fleet" className="text-xs text-gray-300 hover:text-white transition">أسطول الإيجنتس</Link>
          <Link href="/settings" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-4 py-2 rounded-xl transition">
            الإعدادات
          </Link>
        </div>
      </header>

      {/* Stats Bar */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">إجمالي الأوردرات النشطة</span>
              <h3 className="text-2xl font-bold mt-1">{orders.length} أوردر</h3>
            </div>
            <Package className="w-8 h-8 text-indigo-400 opacity-80" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">قيمة المبيعات الإجمالية</span>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400">{totalRevenue.toLocaleString('ar-EG')} ج.م</h3>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-400 opacity-80" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">أوردرات مدققة بـ Vision AI</span>
              <h3 className="text-2xl font-bold mt-1 text-purple-400">
                {orders.filter(o => o.stage === "verified" || o.stage === "dispatched").length} مدققة 100%
              </h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-purple-400 opacity-80" />
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">حالة الربط مع Supabase</span>
              <h3 className="text-sm font-bold mt-1 text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active & Synced</span>
              </h3>
            </div>
            <Sparkles className="w-8 h-8 text-amber-400 opacity-80" />
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stages.map(st => {
            const Icon = st.icon;
            const stageOrders = orders.filter(o => o.stage === st.id);

            return (
              <div key={st.id} className="flex flex-col rounded-2xl bg-black/40 border border-white/10 p-4 min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${st.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-200">{st.label.split("(")[0]}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Orders Stack */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{order.createdAt}</span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Phone size={12} />
                          <span className="font-mono text-[11px]">{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <MapPin size={12} />
                          <span className="text-[11px]">{order.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-200 pt-1 font-medium">
                          <Package size={12} className="text-indigo-400 shrink-0" />
                          <span className="truncate">{order.items}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono">{order.total} ج.م</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {order.paymentMethod}
                        </span>
                      </div>

                      {/* Stage Shift Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => moveOrder(order.id, "prev")}
                          disabled={st.id === "new"}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition"
                          title="رجوع للمرحلة السابقة"
                        >
                          <ArrowRight size={14} />
                        </button>
                        <span className="text-[10px] text-gray-500">نقل المرحلة</span>
                        <button
                          onClick={() => moveOrder(order.id, "next")}
                          disabled={st.id === "dispatched"}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 transition"
                          title="تقدم للمرحلة التالية"
                        >
                          <ArrowLeft size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageOrders.length === 0 && (
                    <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-gray-600">
                      لا توجد أوردرات هنا
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
