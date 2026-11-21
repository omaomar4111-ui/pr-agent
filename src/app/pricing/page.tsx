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
  Store,
  Coins,
  Cpu,
  Layers,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedContacts, setSelectedContacts] = useState(2500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic Contact/Credit calculation based on slider
  const getDynamicPlanPrice = (contacts: number) => {
    if (contacts <= 1000) return { monthly: 390, yearly: 312, label: "باقة Starter" };
    if (contacts <= 3000) return { monthly: 690, yearly: 552, label: "باقة Growth AI" };
    if (contacts <= 7500) return { monthly: 1190, yearly: 952, label: "باقة Scale AI" };
    return { monthly: 1990, yearly: 1592, label: "باقة Enterprise AI" };
  };

  const dynamicPricing = getDynamicPlanPrice(selectedContacts);
  const currentPrice = billingPeriod === "monthly" ? dynamicPricing.monthly : dynamicPricing.yearly;

  // ManyChat Comparison Anchor:
  // ManyChat 2,500 contacts = $39 (~1,950 EGP) without InstaPay OCR, without Egyptian Dialect, without Bosta AWB.
  // PR Agent 2,500 contacts = 690 EGP WITH all Arabic AI features!

  const plans = [
    {
      id: "free_trial",
      name: "تجربة الـ 3 أيام المجانية",
      badge: "بدون فيزا نهائياً",
      price: 0,
      period: "3 أيام مجاناً",
      contactsLimit: "100 جهة اتصال / محادثة",
      creditsIncluded: "500 رصيد AI مجاني",
      desc: "افتح كل إمكانيات المنصة فحص إنستاباي، والردود الذكية وتأهيل العقارات لمدة 3 أيام لتتأكد من النتائج.",
      features: [
        "100 عميل نشط (Active Contacts)",
        "500 كريديت AI للردود الفورية الذكية",
        "فحص إيصالات إنستاباي بالرؤية الجنائية (Vision AI)",
        "ربط واتساب فوري عبر رمز QR",
        "تأهيل عملاء العقارات وليدز الملابس",
        "درع حماية كاملة ضد الحظر (Anti-Ban Guard)"
      ],
      popular: false,
      ctaText: "ابدأ الـ 3 أيام مجاناً",
      isFree: true
    },
    {
      id: "growth",
      name: "باقة النمو (Growth AI)",
      badge: "أرخص من ManyChat بـ 65%",
      priceMonthly: 690,
      priceYearly: 552,
      contactsLimit: "حتى 3,000 عميل نشط / شهر",
      creditsIncluded: "15,000 كريديت ردود ذكية شهرياً",
      desc: "الباقة الأكثر مبيعاً للمتاجر وشركات العقارات: تشمل فحص إنستاباي، السلات المهجورة، وبوالص الشحن.",
      features: [
        "3,000 عميل نشط شهرياً (غير محدود الرسائل لنفس العميل)",
        "15,000 كريديت AI توليدي فاهم اللهجة المصرية والعربية",
        "فحص إيصالات إنستاباي بالرؤية الجنائية غير المحدود",
        "العميل الاستباقي (Proactive) لاسترجاع السلات المهجورة",
        "متابعة إيصالات إنستاباي المعلقة بعد 60 دقيقة آلياً",
        "تأهيل عملاء العقارات وليدز الفيلات والشقق",
        "إصدار بوالص الشحن التلقائية (بوسطة وأوتو وأرامكس)",
        "تكلفة الكريديت الزائد: 0.05 ج.م فقط (الأرخص إطلاقاً)"
      ],
      popular: true,
      ctaText: "اشترك في باقة النمو (تجربة 3 أيام مشمولة)"
    },
    {
      id: "scale",
      name: "باقة التوسع والشركات (Scale & High Volume)",
      badge: "للبراندات والمطورين العقاريين",
      priceMonthly: 1450,
      priceYearly: 1160,
      contactsLimit: "حتى 10,000 عميل نشط / شهر",
      creditsIncluded: "60,000 كريديت ردود ذكية شهرياً",
      desc: "للشركات ذات الضغط العالي والتوكيلات العقارية الضخمة التي تبحث عن أقصى سرعة وأعلى سعة محادثات.",
      features: [
        "10,000 عميل نشط شهرياً مع إمكانية التوسع المرن",
        "60,000 كريديت AI متقدم لمعالجة الاستفسارات المعقدة",
        "تكامل مخصص مع أنظمة الـ ERP والـ CRM ومستودعات الشركات",
        "ربط متعدد لقنوات الواتساب وإنستجرام وفيسبوك",
        "مدير حساب تقني مخصص مع خط طوارئ 24/7",
        "خوادم فائقة السرعة مع أولوية معالجة بنسبة 99.9% SLA",
        "عزل كامل للبيانات بقاعدة بيانات مخصصة"
      ],
      popular: false,
      ctaText: "ابدأ باقة التوسع (تجربة 3 أيام مشمولة)"
    }
  ];

  const faqs = [
    {
      q: "ما معنى 'العميل النشط' (Active Contact) والكريديت؟",
      a: "مثل نظام ManyChat تماماً: العميل النشط هو أي شخص يراسلك أو يكتب تعليقاً خلال الشهر، ومهما تبادلتم من رسائل طوال الشهر يُحسب كعميل واحد فقط! أما الكريديت (Credits) فيُستخدم فقط عندما يقوم الذكاء الاصطناعي بتوليد رد جديد أو فحص إيصال إنستاباي بالرؤية."
    },
    {
      q: "كيف تنافس أسعار PR Agent منصة ManyChat؟",
      a: "في ManyChat، باقة الـ 2,500 عميل تكلف 39$ شهرياً (حوالي 1,950 ج.م) وبدون فهم للهجة المصرية وبدون فحص إنستاباي وبدون ربط بوسطة. بينما في PR Agent تحصل على 3,000 عميل نشط بـ 690 ج.م فقط شاملة كافة ميزات الذكاء الاصطناعي الجنائي وبوالص الشحن (توفير أكثر من 65%)!"
    },
    {
      q: "ماذا يحدث إذا استهلكت كل رصيد الكريديت أو العملاء؟",
      a: "السيستم لا يتوقف إطلاقاً! يمكنك شحن رصيد كريديت إضافي في أي وقت بأسعار رمزية (50 ج.م لكل 1,000 كريديت إضافي)، أو ترقية الشريحة بسلاسة من لوحة التحكم."
    },
    {
      q: "كيف أحصل على التجربة المجانية لمدة 3 أيام؟",
      a: "بمجرد التسجيل برقم هاتفك أو إيميلك، يُشحن حسابك فوراً برصيد 500 كريديت و100 عميل نشط لمدة 3 أيام مجاناً 100% دون الحاجة لإدخال أي بطاقة بنكية."
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
                <span className="font-extrabold text-sm text-white">تجربة مجانية كاملة لمدة 3 أيام</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  شاملة 500 كريديت AI وبدون فيزا
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                افتح كل ميزات فحص إنستاباي والردود الذكية وتأهيل ليدز العقارات مجاناً بالكامل.
              </p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 shrink-0"
          >
            <span>تفعيل الـ 3 أيام مجاناً</span>
            <ArrowRight size={14} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
          <Coins size={14} className="text-emerald-400" />
          <span>نظام باقات وكريديت عادل ومرن • ادفع فقط مقابل ما تستهلكه</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          باقات ذكية تنافس ManyChat بمميزات حصرية
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          نفس نظام جهات الاتصال النشطة (Active Contacts) والكريديت المعتمد عالمياً، لكن بنصف التكلفة وبدعم كامل للهجة المصرية وفحص إنستاباي الجنائي وبوالص الشحن.
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
                خصم 20% (شهرين مجاناً)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Contact & Credit Calculator (ManyChat Style Slider) */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16 p-6 rounded-3xl bg-[#110c22]/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <Sliders size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">حاسبة حجم العملاء والكريديت المخصص</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
            {dynamicPricing.label}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-gray-400">عدد العملاء النشطين شهرياً (Active Contacts):</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {selectedContacts.toLocaleString()} عميل نشط
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="15000"
            step="500"
            value={selectedContacts}
            onChange={(e) => setSelectedContacts(Number(e.target.value))}
            className="w-full accent-emerald-400 h-2 bg-white/10 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>500 عميل</span>
            <span>3,000 عميل</span>
            <span>7,500 عميل</span>
            <span>15,000+ عميل</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-purple-400" />
              <span>الرصيد التوليدي المقدر: <strong className="text-white font-mono">{Math.round(selectedContacts * 5).toLocaleString()} كريديت AI</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">السعر المقدر:</span>
              <span className="text-lg font-black font-mono text-white">
                {currentPrice} ج.م / شهر
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                (مقارنة بـ {selectedContacts >= 2500 ? "1,950+ ج.م في ManyChat" : "850+ ج.م"})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan) => {
          const price = plan.isFree ? 0 : (billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly);
          
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
                  <Flame size={13} /> الباقة الأكثر مبيعاً والأعلى توفيراً
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
                      {plan.isFree ? "0" : price?.toLocaleString("ar-EG")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {plan.isFree ? "ج.م (مجاناً)" : "ج.م / شهرياً"}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-mono font-medium">
                    {plan.contactsLimit}
                  </div>
                  <div className="text-[10px] text-purple-300 font-mono mt-0.5">
                    ⚡ {plan.creditsIncluded}
                  </div>
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

      {/* Credit System Breakdown (Transparent Explainer) */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-[#110c22]/70 border border-white/10 p-8 mb-20 shadow-xl">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">✦ كيف يُحسب الكريديت والعملاء؟</span>
          <h2 className="text-2xl font-bold text-white">نظام استهلاك عادل 100% بدون أي هدر</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <MessageSquare size={16} />
              <span>العميل النشط (Contact)</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              يُحتسب العميل مرة واحدة فقط في الشهر بغض النظر عن عدد الرسائل التي يتبادلها معك. لا تدفع أبداً على جهات الاتصال القديمة غير النشطة!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Coins size={16} />
              <span>كريديت الذكاء الاصطناعي</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              كل رد ذكي يولده الإيجنت يستهلك 1 كريديت فقط. فحص إيصال إنستاباي الجنائي يستهلك 2 كريديت. شحن الكريديت الإضافي يبدأ من 50 ج.م فقط!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <ShieldCheck size={16} />
              <span>بدون مفاجآت في الفاتورة</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              لا نقوم بإيقاف حسابك إذا نفد الرصيد فجأة، بل يستمر النظام في تلقي الرسائل وتنبيهك فوراً لإعادة الشحن بكل مرونة.
            </p>
          </div>
        </div>
      </div>

      {/* Competitor Comparison Snapshot */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-3xl bg-[#110c22]/60 border border-white/5 p-8 backdrop-blur-xl mb-20 shadow-xl">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">✦ المقارنة مع ManyChat و Replyse</span>
          <h2 className="text-2xl font-bold text-white">مقارنة الأسعار والمميزات وجهاً لوجه</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3 font-semibold">الميزة ومستوى الباقة</th>
                <th className="pb-3 font-bold text-emerald-400">PR Agent (نظامنا)</th>
                <th className="pb-3 font-semibold text-gray-400">ManyChat Pro</th>
                <th className="pb-3 font-semibold text-gray-400">Replyse.tech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              <tr>
                <td className="py-3 font-medium text-white">سعر 2,500 إلى 3,000 عميل نشط</td>
                <td className="py-3 font-bold text-emerald-400 font-mono">690 ج.م / شهر</td>
                <td className="py-3 font-mono text-red-400">39$ (~1,950 ج.م)</td>
                <td className="py-3 font-mono text-gray-400">1,200+ ج.م</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">تجربة مجانية كاملة بكريديت AI</td>
                <td className="py-3 font-bold text-emerald-400">✓ 3 أيام مجاناً (500 كريديت)</td>
                <td className="py-3 text-gray-400">باقة مجانية بدون واتساب</td>
                <td className="py-3 text-gray-400">تجربة محدودة جداً</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">فحص إيصالات إنستاباي (Vision OCR)</td>
                <td className="py-3 font-bold text-emerald-400">✓ مدمج وتلقائي 100%</td>
                <td className="py-3 text-red-400">✗ غير متاح إطلاقاً</td>
                <td className="py-3 text-red-400">✗ غير متاح</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">تأهيل عملاء العقارات وليدز الفيلات</td>
                <td className="py-3 font-bold text-emerald-400">✓ جاهز ومخصص (Real Estate)</td>
                <td className="py-3 text-gray-400">يحتاج بناء يدوي معقد</td>
                <td className="py-3 text-gray-400">عام فقط</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">العميل الاستباقي (Proactive Recovery)</td>
                <td className="py-3 font-bold text-emerald-400">✓ استرجاع السلات المهجورة آلياً</td>
                <td className="py-3 text-gray-400">يحتاج إعداد فلوهات خارجية</td>
                <td className="py-3 text-gray-400">يدوي</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">إصدار بوالص الشحن (بوسطة وأوتو)</td>
                <td className="py-3 font-bold text-emerald-400">✓ فوري بنقرة واحدة</td>
                <td className="py-3 text-red-400">✗ غير مدعوم محلياً</td>
                <td className="py-3 text-gray-400">محدود</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-100">الأسئلة الشائعة حول الكريديت والباقات</h2>
          <p className="text-xs text-slate-400 mt-1">كل ما تحتاج معرفته عن استهلاك الكريديت وتفعيل التجربة المجانية</p>
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
