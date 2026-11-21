"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Zap,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Database,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Layers,
  LineChart,
  Bot
} from "lucide-react";
import { GlowingSpotlightCard } from "@/components/GlowingSpotlightCard";
import { NumberTicker } from "@/components/NumberTicker";

// Dynamically import 3D Canvas with ssr disabled to prevent hydration mismatch
const Hero3DScene = dynamic(() => import("@/components/Hero3DScene").then((m) => m.Hero3DScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] md:h-[550px] flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border border-purple-500/30 animate-pulse bg-purple-600/10 blur-xl" />
    </div>
  ),
});

export default function PremiumAIAnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState("revenue");

  return (
    <div className="min-h-screen bg-[#05030A] text-white font-sans selection:bg-purple-600 selection:text-white overflow-hidden" dir="rtl">
      {/* Background Volumetric Glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
              <Sparkles size={14} className="text-purple-400" />
              <span>Next-Gen Autonomous Intelligence Engine</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              ذكاء تحليلي فائق <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                يدير تجارتك وقراراتك
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
              محرك تحليلات مدعوم بالـ 3D Neural Agents يفكك بيانات مبيعاتك، يكتشف تسريبات السلات المتروكة، ويتوقع الأرباح بدقة 99.4% لحظياً.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white transition shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-2.5"
              >
                <span>دخول لوحة التحليلات الحية</span>
                <ArrowLeft size={16} />
              </Link>

              <Link
                href="/fleet"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-sm font-semibold text-slate-300 transition flex items-center gap-2"
              >
                <Bot size={16} className="text-purple-400" />
                <span>استكشاف أسطول الوكلاء</span>
              </Link>
            </div>

            {/* Quick Metrics Proof */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-white">
                  <NumberTicker value={99.4} decimalPlaces={1} suffix="%" />
                </div>
                <div className="text-xs text-slate-500 mt-1">دقة توقعات الـ AI</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-purple-400">
                  <NumberTicker value={1.4} decimalPlaces={1} suffix="s" />
                </div>
                <div className="text-xs text-slate-500 mt-1">زمن المعالجة الفوري</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  +<NumberTicker value={42} suffix="%" />
                </div>
                <div className="text-xs text-slate-500 mt-1">زيادة معدل التحويل</div>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Hero Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent rounded-full filter blur-3xl pointer-events-none" />
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Architected for Speed</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            بنية تحتية متقدمة تفهم لغة الأرقام وسلوك المشترين
          </h2>
          <p className="text-sm text-slate-400">
            تكامل فوري يجمع بين الرؤية الحاسوبية (Vision OCR) ومعالجة اللغة العربية واللهجة المصرية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlowingSpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-4">
              <BrainCircuit size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">التنبؤ اللحظي بسلوك المتسوقين</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              خوارزميات تصنف كل عميل يدخل في الشات (مشتري جاد، متردد، مستفسر عن السعر) وتوجه الردود المناسبة لغلق الأوردر فورياً.
            </p>
          </GlowingSpotlightCard>

          <GlowingSpotlightCard spotlightColor="rgba(56, 189, 248, 0.25)">
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 mb-4">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">رصد الإيراد ومعدل العائد (LTV)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحليل عميق يربط قيمة طلبات الشراء الواردة من واتساب وفيسبوك وإنستاجرام لتعرف بالضبط أي حملة إعلانية تجلب مبيعات حقيقية.
            </p>
          </GlowingSpotlightCard>

          <GlowingSpotlightCard spotlightColor="rgba(16, 185, 129, 0.25)">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">كشف الاحتيال وتدقيق الدفع (Argon Guard)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              محرك فحص إيصالات إنستاباي ومحافظ فودافون كاش لمنع الإيصالات المزيفة والمفبركة بالذكاء الاصطناعي بنسبة حماية 100%.
            </p>
          </GlowingSpotlightCard>
        </div>
      </section>
    </div>
  );
}
