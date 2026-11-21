"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown,
  Gift,
  Clock,
  CheckCircle2,
  Lock,
  Flame,
  Building2,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumberTicker } from "@/components/NumberTicker";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [conversationsPerMonth, setConversationsPerMonth] = useState(2500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ROI Calculator
  const estimatedSavedHours = Math.round((conversationsPerMonth * 3) / 60); // 3 mins per human chat
  const estimatedSavedCost = Math.round(estimatedSavedHours * 50); // 50 EGP/hr human employee rate
  const subscriptionCost = billingPeriod === "monthly" ? 790 : 632;
  const netProfit = Math.max(0, estimatedSavedCost - subscriptionCost);

  // Highly competitive pricing designed to dominate Replyse & ManyChat in the Egyptian & Arab market
  const plans = [
    {
      id: "starter",
      name: "باقة الانطلاق (Starter)",
      badge: "أرخص من راتب موظف بيومين",
      priceMonthly: 390,
      priceYearly: 312,
      desc: "مثالية للمشاريع الناشئة وصفحات الإنستجرام والواتساب التي تبحث عن رد آلي سريع وموثوق.",
      features: [
        "إيجنت ذكاء اصطناعي فاهم اللهجة المصرية والعربية",
        "رد آلي فوري على رسائل الواتساب و إنستجرام DM",
        "تحويل الكومنتات لرسائل خاصة (Comment-to-DM)",
        "كتالوج منتجات ذكي حتى 250 منتج/عقار",
        "لوحة كانبان CRM لمتابعة حالات الطلبات",
        "درع حماية ضد الحظر (Anti-Ban Guard)",
        "تجربة مجانية كاملة لمدة 3 أيام بدون فيزا"
      ],
      popular: false,
      trialBanner: "🎁 تجربة مجانية 3 أيام متاحة",
      ctaText: "ابدأ تجربة الـ 3 أيام مجاناً"
    },
    {
      id: "growth",
      name: "باقة النمو الذكي (Growth AI)",
      badge: "الأكثر طلباً للتجار والشركات",
      priceMonthly: 790,
      priceYearly: 632,
      desc: "الحل الشامل للمتاجر وشركات العقارات: فحص إيصالات إنستاباي، والعميل الاستباقي، وربط الشحن.",
      features: [
        "كل ميزات باقة Starter",
        "فحص إيصالات إنستاباي الجنائي بالرؤية (Vision AI OCR)",
        "العميل الاستباقي (Proactive AI) لاسترجاع السلات المهجورة",
        "متابعة إيصالات إنستاباي المعلقة بعد 60 دقيقة آلياً",
        "تأهيل عملاء العقارات والليدز (Real Estate Qualifier)",
        "إصدار بوالص الشحن التلقائية (بوسطة وأوتو وأرامكس)",
        "كتالوج ومنتجات غير محدودة",
        "أولوية معالجة في ثوانٍ معدودة عبر عتاد سحابي فائق"
      ],
      popular: true,
      trialBanner: "⚡ تشمل كل ميزات الـ AI لمدة 3 أيام مجاناً",
      ctaText: "جرّب باقة النمو 3 أيام مجاناً"
    },
    {
      id: "enterprise",
      name: "باقة الشركات والتوكيلات (Enterprise)",
      badge: "للمؤسسات والبراندات الكبرى",
      priceMonthly: 1650,
      priceYearly: 1320,
      desc: "حل غير محدود للشركات الكبرى، التوكيلات، والمطورين العقاريين بحجم محادثات ضخم.",
      features: [
        "كل ميزات باقة Growth AI بالكامل",
        "عدد غير محدود من قنوات الواتساب وإنستجرام وفيسبوك",
        "ربط مخصص مع أنظمة الـ ERP والـ CRM ومخازن الشركات",
        "مدير حساب تقني مخصص مع خط دعم طوارئ 24/7",
        "تدريب مخصص للنموذج على وثائق ونبرة شركتك الداخلية",
        "اتفاقية مستوى الخدمة SLA 99.9% مع سرية بيانات مصرفية",
        "عزل كامل للبيانات بقاعدة بيانات مخصصة (Dedicated DB)"
      ],
      popular: false,
      trialBanner: "🏢 استشارة وتجربة عملية مع فريق المهندسين",
      ctaText: "تواصل مع مستشار الأنظمة"
    }
  ];

  const faqs = [
    {
      q: "كيف تعمل التجربة المجانية لمدة 3 أيام؟",
      a: "بمجرد تسجيل الدخول وربط رقم الواتساب أو متجرك، تُفتح لك كافة ميزات المنصة بالكامل (بما فيها Vision AI لفحص إنستاباي والـ Proactive Agent) لمدة 3 أيام مجاناً 100% بدون إدخال أي بطاقة بنكية."
    },
    {
      q: "هل الأسعار منافسة مقارنة بالمنصات الأخرى؟",
      a: "نعم وبفارق هائل! باقة الـ Starter بـ 390 ج.م فقط وباقة الـ Growth الشاملة بـ 790 ج.م فقط، في حين تبدأ المنصات العالمية مثل ManyChat و Intercom من 25$ إلى 60$ شهرياً (أكثر من 1,500 - 3,000 ج.م) وبدون دعم فحص إنستاباي أو فهم العامية المصرية."
    },
    {
      q: "هل أحتاج لفيزا أو كارت بنكي لبدء التجربة المجانية؟",
      a: "نهائياً! التجربة مجانية تماماً وبدون أي التزام مالي. سجل برقم هاتفك أو إيميلك وابدأ العمل في دقيقتين."
    },
    {
      q: "هل النظام يدعم شركات العقارات (Real Estate)؟",
      a: "نعم، النظام يتضمن نموذج تأهيل عقاري متخصص يسأل العميل عن الميزانية والموقع ونوع الوحدة ونظام السداد، ويرسل البروشورات ويحوّل الليد المؤهل فوراً لمسؤول المبيعات."
    },
    {
      q: "ماذا يحدث بعد انتهاء الـ 3 أيام تجربة؟",
      a: "ستتمكن من اختيار الباقة الأنسب لمبيعاتك ومتابعة نشاطك عبر الدفع بإنستاباي أو فودافون كاش أو البطاقات البنكية دون فقدان أي محادثات أو طلبات مسجلة."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-12 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Background Volumetric Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-br from-purple-600/15 via-emerald-600/10 to-transparent blur-[150px] pointer-events-none rounded-full" />

      {/* 3-Days Free Trial Hero Banner */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0e1f18] to-purple-950/60 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Gift size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">تجربة مجانية شاملة لمدة 3 أيام</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  بدون فيزا أو بطاقة بنكية
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                جرّب إيجنت المبيعات وفحص إنستاباي التلقائي وبوالص الشحن على متجرك الحقيقي وتأكد من النتائج بنفسك.
              </p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 shrink-0"
          >
            <span>ابدأ الـ 3 أيام الآن</span>
            <ArrowRight size={14} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
          <Sparkles size={14} className="text-purple-400" />
          <span>أقوى ميزات بأفضل سعر تنافسي في مصر والشرق الأوسط</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          خطط أسعار مصممة لتسبق جميع منافسيك
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          وفّر أكثر من 80% من تكاليف خدمة العملاء والمرتبات، وضاعف سرعة إتمام الأوردرات وحجز المبيعات في ثوانٍ معدودة.
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
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                خصم 20% إضافي
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
                plan.popular 
                  ? "border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.25)] bg-[#100b24]/90 ring-1 ring-emerald-500/40" 
                  : "bg-[#0d091a]/80"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-[11px] font-extrabold text-black shadow-lg flex items-center gap-1">
                  <Flame size={13} /> الأكثر توفيراً وطلباً للمتاجر
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                </div>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                  {plan.badge}
                </span>
                <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">{plan.desc}</p>

                {/* Price Display */}
                <div className="my-5 pb-5 border-b border-white/5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-emerald-300 tracking-tight">
                      {price.toLocaleString("ar-EG")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">ج.م / شهرياً</span>
                  </div>
                  {billingPeriod === "yearly" ? (
                    <div className="text-[11px] text-emerald-400 mt-1 font-medium">يُدفع سنوياً مع توفير شهرين مجاناً</div>
                  ) : (
                    <div className="text-[11px] text-purple-300 mt-1 font-mono">3 أيام تجربة مجانية مشمولة بالكامل</div>
                  )}
                </div>

                {/* Trial Pill on Card */}
                <div className="mb-5 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>{plan.trialBanner}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/onboarding" className="w-full">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                  className={`w-full text-xs font-bold ${
                    plan.popular ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)]" : ""
                  }`}
                >
                  {plan.ctaText}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Interactive ROI Calculator */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-[#110c22]/90 border border-purple-500/20 p-8 backdrop-blur-xl mb-20 shadow-2xl">
        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
          <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
            <Zap size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">حاسبة العائد على الاستثمار والوفر المالي (ROI Calculator)</h2>
            <p className="text-xs text-slate-400 mt-0.5">احسب كم ستوفّر شهرياً من وقت موظفي خدمة العملاء وتكاليف الرواتب</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 items-center">
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>عدد المحادثات الشهرية المتوقعة:</span>
                <span className="font-mono text-purple-400 text-sm font-bold">
                  {conversationsPerMonth.toLocaleString()} محادثة
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={conversationsPerMonth}
                onChange={(e) => setConversationsPerMonth(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>500</span>
                <span>10,000</span>
                <span>20,000+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-slate-400 block">ساعات العمل البشرية الموفرة:</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  ~{estimatedSavedHours} ساعة
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-slate-400 block">تكلفة الرواتب التقليدية الموفرة:</span>
                <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                  ~{estimatedSavedCost.toLocaleString()} ج.م
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-emerald-950/30 to-black/60 border border-emerald-500/30 text-center space-y-3">
            <span className="text-xs text-gray-400 block">صافي الربح والوفر الشهري لمتجرك:</span>
            <div className="text-3xl lg:text-4xl font-black font-mono text-emerald-400 tracking-tight">
              +{netProfit.toLocaleString()} ج.م
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              باستخدامك باقة Growth، توفر راتب 2-3 موظفين مع استجابة فورية 24/7 دون أي تأخير.
            </p>
            <Link href="/onboarding" className="block pt-2">
              <Button size="sm" variant="primary" className="w-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black">
                ابدأ الـ 3 أيام تجربة مجانية
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Competitor Comparison Snapshot */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-[#110c22]/60 border border-white/5 p-8 backdrop-blur-xl mb-20 shadow-xl">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">✦ المقارنة السوقية الصريحة</span>
          <h2 className="text-2xl font-bold text-white">لماذا يختار التجار PR Agent؟</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3 font-semibold">الميزة الأساسية</th>
                <th className="pb-3 font-bold text-emerald-400">PR Agent</th>
                <th className="pb-3 font-semibold text-gray-400">Replyse.tech</th>
                <th className="pb-3 font-semibold text-gray-400">ManyChat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="py-3 font-medium text-white">السعر الشهري المبدئي</td>
                <td className="py-3 font-bold text-emerald-400 font-mono">390 ج.م فقط</td>
                <td className="py-3 font-mono text-gray-400">950+ ج.م</td>
                <td className="py-3 font-mono text-gray-400">1,250+ ج.م ($25+)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">فترة تجربة مجانية كاملة</td>
                <td className="py-3 font-bold text-emerald-400">✓ 3 أيام مجاناً (بدون فيزا)</td>
                <td className="py-3 text-gray-400">محدودة</td>
                <td className="py-3 text-gray-400">محدودة الخصائص</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">فحص إيصالات إنستاباي الجنائي (Vision AI)</td>
                <td className="py-3 font-bold text-emerald-400">✓ مدمج وتلقائي 100%</td>
                <td className="py-3 text-red-400/80">✗ غير متاح</td>
                <td className="py-3 text-red-400/80">✗ غير متاح</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">تأهيل عملاء العقارات وليدز الفيلات</td>
                <td className="py-3 font-bold text-emerald-400">✓ جاهز ومخصص (Real Estate)</td>
                <td className="py-3 text-gray-400">عام فقط</td>
                <td className="py-3 text-gray-400">يحتاج بناء يدوي معقد</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">العميل الاستباقي (Proactive Recovery)</td>
                <td className="py-3 font-bold text-emerald-400">✓ استرجاع السلات المهجورة ذاتياً</td>
                <td className="py-3 text-gray-400">يدوي</td>
                <td className="py-3 text-gray-400">يحتاج تكلفة إضافية</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">إصدار بوالص الشحن (بوسطة وأوتو)</td>
                <td className="py-3 font-bold text-emerald-400">✓ بنقرة واحدة آلياً</td>
                <td className="py-3 text-gray-400">محدود</td>
                <td className="py-3 text-red-400/80">✗ غير مدعوم محلياً</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-100">الأسئلة الشائعة حول الخطط والتجربة</h2>
          <p className="text-xs text-slate-400 mt-1">كل ما تحتاج معرفته عن الأسعار وتفعيل التجربة المجانية</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-[#110c22]/70 backdrop-blur-md overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
