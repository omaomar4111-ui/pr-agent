"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageSquare, Zap, ShieldCheck, Sparkles, ArrowRight, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumberTicker } from "@/components/NumberTicker";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [conversationsPerMonth, setConversationsPerMonth] = useState(2500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ROI Calculator
  const estimatedSavedHours = Math.round((conversationsPerMonth * 3) / 60); // 3 mins per human chat
  const estimatedSavedCost = Math.round(estimatedSavedHours * 45); // 45 EGP/hr employee cost
  const subscriptionCost = billingPeriod === "monthly" ? 1450 : 1208;
  const netProfit = Math.max(0, estimatedSavedCost - subscriptionCost);

  const plans = [
    {
      id: "starter",
      name: "باقة البداية (Starter)",
      priceMonthly: 650,
      priceYearly: 550,
      desc: "مثالية للمتاجر الناشئة والصفحات التي تستقبل حتى 1,000 محادثة شهرياً.",
      features: [
        "إيجنت مبيعات وواتساب للرد الفوري",
        "أتمتة تعليقات إنستجرام (Comment-to-DM)",
        "لوحة CRM كانبان لإدارة الأوردرات",
        "تكامل واتساب عبر رمز QR",
        "دعم فني سريع عبر واتساب"
      ],
      popular: false,
      ctaText: "ابدأ التجربة المجانية"
    },
    {
      id: "growth",
      name: "باقة النمو السريع (Growth)",
      priceMonthly: 1450,
      priceYearly: 1208,
      desc: "للمتاجر المتوسعة التي تبحث عن أتمتة كاملة للمبيعات وتدقيق المدفوعات.",
      features: [
        "كل ميزات باقة Starter",
        "تدقيق إيصالات إنستاباي بالرؤية البصرية (Vision AI)",
        "أسطول الوكلاء المستقلين (OpenMausBot Fleet)",
        "تصدير بوالص الشحن التلقائية (بوسطة وأرامكس)",
        "محرك إعادة استهداف السلات المتروكة (Broadcast)",
        "أولوية في معالجة الشات وسرعة الرد اللحظية"
      ],
      popular: true,
      ctaText: "اشترك الآن وضاعف مبيعاتك"
    },
    {
      id: "enterprise",
      name: "باقة الشركات (Enterprise)",
      priceMonthly: 2900,
      priceYearly: 2415,
      desc: "حل مخصص للبراندات الكبرى والمتاجر ذات الحجم الضخم لعدد محادثات غير محدود.",
      features: [
        "كل ميزات باقة Growth",
        "عدد غير محدود من الوكلاء والمحادثات",
        "ربط مخصص مع ERP وأنظمة المستودعات",
        "مدير حساب مخصص (Account Manager)",
        "تدريب مخصص للذكاء الاصطناعي على نبرة علامتك التجارية",
        "اتفاقية مستوى الخدمة SLA 99.9%"
      ],
      popular: false,
      ctaText: "تواصل مع فريق المبيعات"
    }
  ];

  const faqs = [
    {
      q: "هل أحتاج لمعرفة تقنية أو كتابة كود لتشغيل PR Agent؟",
      a: "إطلاقاً. كل ما عليك فعله هو مسح رمز QR من هاتفك لتوصيل واتساب وإدخال منتجاتك في الكتالوج، وسيتعلم الذكاء الاصطناعي كل شيء فورياً."
    },
    {
      q: "كيف يقوم النظام بفحص إيصالات إنستاباي؟",
      a: "بمجرد أن يرسل العميل لقطة شاشة التحويل في الشات، يقوم محرك الرؤية البصرية (Vision AI) بقراءة المبلغ، اسم الراسل، ورقم المعاملة المرجعي، ويطابقه مع قيمة الطلب دون تدخل يدوي."
    },
    {
      q: "هل هناك أي خطر لحظر رقم الواتساب الخاص بي؟",
      a: "النظام مزود بـ Anti-Ban Guard يطبق فترات تأخير عشوائية ويحاكي سرعة كتابة الإنسان لتفادي أي قيود من ميتا."
    },
    {
      q: "هل يمكنني تجربة المنصة مجاناً قبل الدفع؟",
      a: "نعم، نقدم فترة تجربة مجانية كاملة لـ 7 أيام لتجربة الردود الحية على متجرك والتأكد من النتائج بنفسك."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-12 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Background Volumetric Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
          <Sparkles size={14} className="text-purple-400" />
          <span>Transparent Pricing • Zero Hidden Fees</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          استثمر في مضاعفة مبيعات متجرك، وليس في زيادة التكاليف
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          اختر الخطة المناسبة لحجم متجرك. وفّر أكثر من 80% من تكاليف خدمة العملاء وزد سرعة إتمام الأوردرات إلى ثوانٍ.
        </p>

        {/* Billing Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                billingPeriod === "monthly" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              دفع شهري
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                billingPeriod === "yearly" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>دفع سنوي</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                خصم 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan) => {
          const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly;
          return (
            <Card
              key={plan.id}
              hover
              className={`relative flex flex-col justify-between ${
                plan.popular ? "border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.25)] bg-[#120a26]/70" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[11px] font-bold text-white shadow-lg flex items-center gap-1">
                  <Sparkles size={12} /> الباقة الأكثر طلباً للمتاجر
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.desc}</p>

                <div className="my-6 pb-6 border-b border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                      {price.toLocaleString("ar-EG")}
                    </span>
                    <span className="text-xs text-slate-400">ج.م / شهرياً</span>
                  </div>
                  {billingPeriod === "yearly" && (
                    <div className="text-[11px] text-emerald-400 mt-1">يُدفع سنوياً مع توفير شهرين كاملين</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check size={11} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/dashboard" className="w-full">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                  className="w-full text-xs font-bold"
                >
                  {plan.ctaText}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Interactive ROI Calculator */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl mb-20 shadow-2xl">
        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
          <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
            <Zap size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">حاسبة العائد على الاستثمار (ROI Calculator)</h2>
            <p className="text-xs text-slate-400 mt-0.5">احسب كم ستوفّر شهرياً من وقت موظفي خدمة العملاء وتكاليف الرواتب</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-medium">عدد المحادثات الشهرية لمتجرك:</label>
              <span className="font-mono text-sm font-bold text-purple-400">
                {conversationsPerMonth.toLocaleString("ar-EG")} محادثة
              </span>
            </div>

            <input
              type="range"
              min={500}
              max={15000}
              step={250}
              value={conversationsPerMonth}
              onChange={(e) => setConversationsPerMonth(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>500 محادثة</span>
              <span>15,000 محادثة</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">الوقت الموفّر شهرياً:</span>
              <span className="text-2xl font-bold font-mono text-white">
                <NumberTicker value={estimatedSavedHours} /> ساعة
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 block mb-1">صافي التوفير التقديري:</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                <NumberTicker value={netProfit} /> ج.م
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section with Smooth Accordion */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-8">الأسئلة الشائعة</h2>

        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-right text-xs md:text-sm font-bold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
