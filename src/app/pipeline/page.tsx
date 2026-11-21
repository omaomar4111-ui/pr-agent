"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  RefreshCw,
  Plus,
  Phone,
  MapPin,
  Search,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";

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

export default function PipelineKanbanPage() {
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

  const stages = [
    { key: "new", label: "طلبات جديدة (مكتشفة)", color: "text-slate-300", bg: "bg-slate-500/10" },
    { key: "pending_payment", label: "بانتظار الدفع (إنستاباي)", color: "text-amber-400", bg: "bg-amber-500/10" },
    { key: "verified", label: "معتمد ومجهز للشحن", color: "text-purple-400", bg: "bg-purple-500/10" },
    { key: "dispatched", label: "تم تسليمه لشركة الشحن", color: "text-emerald-400", bg: "bg-emerald-500/10" }
  ] as const;

  const moveOrder = (id: string, nextStage: "new" | "pending_payment" | "verified" | "dispatched") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage: nextStage } : o))
    );
    toast("success", `تم نقل الطلب ${id} إلى المرحلة التالية`);
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">مسار خط الطلبات (Order Pipeline)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              Smart Kanban
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            متابعة مراحل كل أوردر من المحادثة الأولى وحتى استلام شركة الشحن.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="secondary" size="md">
              <ArrowRight size={14} /> لوحة التحكم
            </Button>
          </Link>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8 items-start">
        {stages.map((stage) => {
          const stageOrders = orders.filter((o) => o.stage === stage.key);
          return (
            <div
              key={stage.key}
              className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-slate-400">
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-3 flex-1">
                {stageOrders.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-500 border border-dashed border-white/5 rounded-xl">
                    لا توجد طلبات هنا
                  </div>
                ) : (
                  stageOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition shadow-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-purple-400">{order.id}</span>
                        <span className="text-[10px] text-slate-500">{order.createdAt}</span>
                      </div>

                      <div className="font-bold text-xs text-slate-100">{order.customer}</div>
                      <p className="text-[11px] text-slate-300">{order.items}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span className="font-mono font-bold text-emerald-400">{order.total} ج.م</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                          {order.paymentMethod}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-end gap-1">
                        {stage.key === "new" && (
                          <button
                            onClick={() => moveOrder(order.id, "pending_payment")}
                            className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30"
                          >
                            طلب تحويل ←
                          </button>
                        )}
                        {stage.key === "pending_payment" && (
                          <button
                            onClick={() => moveOrder(order.id, "verified")}
                            className="text-[10px] px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30"
                          >
                            اعتماد الإيصال ←
                          </button>
                        )}
                        {stage.key === "verified" && (
                          <button
                            onClick={() => moveOrder(order.id, "dispatched")}
                            className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500/30"
                          >
                            تصدير للشحن ←
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
