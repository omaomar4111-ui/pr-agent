"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  Bot, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  RefreshCw, 
  ArrowLeft,
  DollarSign,
  PhoneCall,
  Flame,
  Layers,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { soundFX } from "@/lib/soundFX";
import { toast } from "@/components/ui/Toast";

interface Trigger {
  id: string;
  type: string;
  title: string;
  status: "active" | "paused";
  targetChannel: "whatsapp" | "instagram";
  delayMinutes: number;
  aiTone: string;
  systemPrompt: string;
  stats: {
    triggeredCount: number;
    recoveredRevenue: number;
    conversionRate: string;
  };
}

interface PendingLead {
  id: string;
  customerName: string;
  phone: string;
  channel: string;
  triggerType: string;
  lastActionTime: string;
  cartItem: string;
  cartValue: number;
  suggestedMessage: string;
}

export default function ProactiveAgentsPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [leads, setLeads] = useState<PendingLead[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firingLeadId, setFiringLeadId] = useState<string | null>(null);

  const fetchProactiveData = async () => {
    try {
      const res = await fetch("/api/agents/proactive");
      const data = await res.json();
      if (data.success) {
        setTriggers(data.triggers);
        setLeads(data.pendingLeads);
        setSummary(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProactiveData();
  }, []);

  const toggleTrigger = async (triggerId: string) => {
    soundFX.playPop();
    try {
      const res = await fetch("/api/agents/proactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", triggerId })
      });
      const data = await res.json();
      if (data.success) {
        setTriggers(data.triggers);
        toast("success", "تم تغيير حالة المشغل الاستباقي بنجاح");
      }
    } catch (e) {
      toast("error", "تعذر تغيير الحالة");
    }
  };

  const fireLead = async (leadId: string) => {
    setFiringLeadId(leadId);
    soundFX.playPop();
    try {
      const res = await fetch("/api/agents/proactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fire_lead", leadId })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        toast("success", `تم إرسال المتابعة الذكية للعميل ${data.lead.customerName} عبر الواتساب`);
        setLeads(prev => prev.filter(l => l.id !== leadId));
      }
    } catch (e) {
      toast("error", "فشل الإرسال الاستباقي");
    } finally {
      setFiringLeadId(null);
    }
  };

  const fireAllPending = async () => {
    soundFX.playPop();
    try {
      const res = await fetch("/api/agents/proactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fire_all_pending" })
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        toast("success", `تم إطلاق ${data.dispatchedCount} متابعة ذكية واسترجاع مبيعات محتملة!`);
        setLeads([]);
      }
    } catch (e) {
      toast("error", "حدث خطأ أثناء الإرسال الجماعي");
    }
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white selection:bg-[#7c3aed] selection:text-white pb-24 font-sans" dir="rtl">
      
      {/* Top Header */}
      <div className="border-b border-purple-500/15 bg-[#0e091a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-[1.5px] shadow-lg shadow-purple-600/30">
              <div className="w-full h-full rounded-2xl bg-[#0b0816] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">العميل الاستباقي (Proactive AI Agent)</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 animate-pulse">
                  ● ذاتي التشغيل 24/7
                </span>
              </div>
              <p className="text-xs text-gray-400">إيجنتس تبادر بمحادثة العميل لاسترجاع السلات المهجورة ومتابعة إنستاباي بدون تدخل بشري</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProactiveData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin text-purple-400" : ""} />
              <span>تحديث الفحص</span>
            </button>
            <button
              onClick={fireAllPending}
              disabled={leads.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              <Flame size={15} />
              <span>إطلاق المتابعة للكل ({leads.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* KPI Revenue Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#120c24] border border-purple-500/20 shadow-xl relative overflow-hidden">
            <span className="text-xs font-bold text-gray-400 block mb-1">المبيعات المسترجعة آلياً</span>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 font-mono">
              {summary ? summary.totalRecoveredRevenue.toLocaleString() : "209,700"} ج.م
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
              <TrendingUp size={12} />
              <span>+38% نمو في إتمام الطلبات المعلقة</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#120c24] border border-purple-500/20 shadow-xl">
            <span className="text-xs font-bold text-gray-400 block mb-1">عملاء في انتظار المبادرة الآن</span>
            <div className="text-2xl font-black text-white font-mono">
              {leads.length} عملاء
            </div>
            <span className="text-[10px] text-purple-300 flex items-center gap-1 mt-2">
              <Clock size={12} />
              <span>فحص آلي كل 15 دقيقة (مجاناً)</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#120c24] border border-purple-500/20 shadow-xl">
            <span className="text-xs font-bold text-gray-400 block mb-1">المشغلات النشطة (Triggers)</span>
            <div className="text-2xl font-black text-purple-400 font-mono">
              {triggers.filter(t => t.status === "active").length} من {triggers.length}
            </div>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
              <span>واتساب وإنستجرام دايركت</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#120c24] border border-emerald-500/20 shadow-xl">
            <span className="text-xs font-bold text-gray-400 block mb-1">متوسط نسبة التحويل</span>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              47.2%
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
              <CheckCircle2 size={12} />
              <span>يتم تحويلهم لأوردرات في الكانبان</span>
            </span>
          </div>
        </div>

        {/* Section 1: Live Opportunities (Leads Ready for Proactive Contact) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h2 className="text-lg font-bold text-white">العملاء المكتشفين حالياً (جاهزين للمبادرة التلقائية)</h2>
            </div>
            <span className="text-xs text-gray-400">الذكاء الاصطناعي يقوم بصياغة الرسالة حسب حالة السلة والمنتج</span>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#110c22] border border-white/5 text-center text-gray-400 space-y-2">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">رائع! لا توجد سلات متروكة أو إيصالات معلقة حالياً</p>
              <p className="text-xs">المساعد الذكي يراقب المحادثات لحظة بلحظة وسيقوم بتنبيهك تلقائياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leads.map((lead) => (
                <div 
                  key={lead.id}
                  className="p-5 rounded-2xl bg-[#120d24] border border-purple-500/25 hover:border-emerald-500/40 shadow-xl space-y-3.5 flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {lead.customerName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{lead.lastActionTime}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="text-[11px] text-gray-400">المنتج المعلق:</span>
                        <span className="font-bold text-purple-300">{lead.cartItem}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">القيمة:</span>
                        <span className="font-mono text-emerald-400 font-bold">{lead.cartValue} ج.م</span>
                      </div>
                    </div>

                    {/* AI Suggested Proactive Message */}
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-gray-200 leading-relaxed relative">
                      <span className="text-[9px] text-purple-400 font-bold block mb-1">💬 رسالة الإيجنت المقترحة:</span>
                      "{lead.suggestedMessage}"
                    </div>
                  </div>

                  <button
                    onClick={() => fireLead(lead.id)}
                    disabled={firingLeadId === lead.id}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                  >
                    {firingLeadId === lead.id ? (
                      <RefreshCw size={14} className="animate-spin text-white" />
                    ) : (
                      <Send size={13} className="rotate-180 text-emerald-400" />
                    )}
                    <span>إرسال المبادرة على الواتساب فوراً</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Proactive Triggers Manager */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">قواعد ومشغلات المبادرة الذكية (Triggers)</h2>
            <span className="text-xs text-purple-300">يمكنك تشغيل وإيقاف أي قاعدة بنقرة واحدة</span>
          </div>

          <div className="space-y-3">
            {triggers.map((trigger) => {
              const isActive = trigger.status === "active";
              return (
                <div 
                  key={trigger.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-wrap items-center justify-between gap-4 ${
                    isActive 
                      ? "bg-[#130e26] border-purple-500/30 shadow-lg shadow-purple-900/20" 
                      : "bg-[#0d091a] border-white/5 opacity-70"
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-gray-500"}`} />
                      <h3 className="text-sm font-bold text-white">{trigger.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-purple-300 border border-white/10 font-mono">
                        تأخير: {trigger.delayMinutes} دقيقة
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {trigger.targetChannel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {trigger.systemPrompt}
                    </p>
                  </div>

                  {/* Stats Pill & Toggle Button */}
                  <div className="flex items-center gap-4">
                    <div className="text-left text-xs space-y-0.5 pl-4 border-l border-white/10">
                      <span className="text-[10px] text-gray-400 block">إجمالي المسترجع:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {trigger.stats.recoveredRevenue.toLocaleString()} ج.م
                      </span>
                      <span className="text-[9px] text-purple-300 block">
                        نسبة النجاح: {trigger.stats.conversionRate}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleTrigger(trigger.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/50"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause size={13} />
                          <span>إيقاف مؤقت</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} className="text-emerald-400" />
                          <span>تفعيل المشغل</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
