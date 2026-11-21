"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Lock, 
  Play, 
  ChevronDown, 
  ArrowUpRight,
  Sliders,
  Send,
  Eye,
  CreditCard,
  Package,
  Layers,
  Radio,
  Truck,
  Code2
} from "lucide-react";
import { InteractivePhoneTour } from "@/components/InteractivePhoneTour";

export default function LandingPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<"inquiry" | "product" | "order">("inquiry");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Widget generator state
  const [copiedWidget, setCopiedWidget] = useState(false);
  const widgetCode = `<script src="https://pr-agent.vercel.app/widget.js" data-tenant="your-store-id" async></script>`;

  const copyWidget = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopiedWidget(true);
    setTimeout(() => setCopiedWidget(false), 2000);
  };

  const faqs = [
    {
      q: "هل المساعد الذكي بيغلط في الردود؟",
      a: "الذكاء الاصطناعي مدرب حصرياً على بيانات منتجاتك وتعليمات متجرك. وفي حال واجه سؤالاً معقداً أو خارج الكتالوج، يقوم فوراً بإحالة المحادثة للموظف البشري دون تأليف."
    },
    {
      q: "محتاج مبرمج أو خبرة تقنية عشان أشغّله؟",
      a: "نهائياً. كل شيء يتم بضغطة زر من لوحة التحكم — ربط صفحات إنستجرام وفيسبوك والواتساب ورفع شيت المنتجات بدون كتابة سطر كود واحد."
    },
    {
      q: "بيفهم العامية المصرية ومصطلحات الشارع؟",
      a: "نعم بنسبة 100%. النظام مصمم خصيصاً للهجة المصرية الدارجة ومصطلحات البيع والشراء السريعة مع دعم الفرانكو العربي."
    },
    {
      q: "إزاي بيكتشف إيصالات إنستاباي المزيفة؟",
      a: "عبر محرك Vision AI الجنائي الذي يقرأ رقم العملية المرجعي وتاريخ ووقت التحويل والمبلغ، ويتأكد أن السكرين شوت غير مكررة أو معدلة بالفوتوشوب."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white selection:bg-[#7c3aed] selection:text-white font-sans antialiased" dir="rtl">
      
      {/* 1. Header Navigation (Exact Replyse Structure + PR Luxury Emblem) */}
      <header className="border-b border-white/10 bg-[#0B0B0D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo size="md" />
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#interactive-demo" className="hover:text-purple-300 transition">شوفه وهو بيشتغل</a>
              <a href="#simulator" className="hover:text-purple-300 transition">مُحاكي تعليم المنتجات</a>
              <a href="#widget" className="hover:text-purple-300 transition">ويدجت المتجر</a>
              <a href="#shipping" className="hover:text-purple-300 transition">بوالص الشحن</a>
              <a href="#questions" className="hover:text-purple-300 transition">أسئلة شائعة</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition px-3 py-1.5">
              دخول
            </Link>
            <Link 
              href="/inbox" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 border border-purple-400/30"
            >
              <span>ابدأ مجاناً</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Exact Replyse Layout & Punchy Messaging) */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles size={14} className="text-purple-400" />
              <span>مساعد المبيعات الأول للتجارة الاجتماعية في مصر</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
              من أول رسالة، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                لطلب جاهز للمتابعة.
              </span>
            </h1>

            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-xl">
              ردّ من بيانات منتجاتك، اجمع قنواتك (إنستجرام، فيسبوك، واتساب)، وخلي فريقك متابع كل خطوة. مساحة واحدة لشغل كان متوزّع في كل مكان.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/inbox" 
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-base transition-all shadow-[0_0_25px_rgba(139,92,246,0.4)] flex items-center gap-2 border border-purple-400/30"
              >
                <span>ابدأ مع PR Agent مجاناً</span>
                <ArrowLeft size={18} />
              </Link>
              <a 
                href="#interactive-demo" 
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-all flex items-center gap-2"
              >
                <Play size={16} className="text-purple-400 fill-purple-400" />
                <span>شاهد العرض التوضيحي</span>
              </a>
            </div>
          </div>

          {/* Hero Side Preview Box */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#14121F] border border-purple-500/20 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>رد آلي فوري مباشر</span>
              </span>
              <span className="font-mono text-purple-300">Instagram & WhatsApp Live</span>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-right space-y-1">
                <span className="text-[10px] text-gray-400">العميل على إنستجرام:</span>
                <p className="text-gray-100 font-medium">لو سمحت الفستان البيج متاح مقاس M؟ وسعر الشحن للإسكندرية كام؟</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-right space-y-1 mr-4">
                <span className="text-[10px] text-purple-300 flex items-center gap-1 font-bold">
                  <Bot size={12} /> PR Agent (رد خلال ثانيتين):
                </span>
                <p className="text-gray-100 font-medium">أهلاً بحضرتك يا فندم! 🌸 نعم الفستان البيج متاح مقاس M وخامة الكتان الصافي بسعر 850 ج.م، والشحن للإسكندرية 45 ج.م ويوصلك بعد بكرة. تحبي نأكد الطلب لحضرتك؟</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <span>تم تسجيل الأوردر في الـ Pipeline تلقائياً</span>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Phone Simulation Tour (Replyse & Intercom Master Level) */}
      <section id="interactive-demo" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <InteractivePhoneTour />
      </section>

      {/* 4. AI Training Simulator (مُحاكي تعليم المنتجات والكتالوج) */}
      <section id="simulator" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">✦ تدريب فوري بضغطة زر</span>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              علّم الإيجنت منتجاتك في دقيقتين فقط
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              مش محتاج تسجل كل سؤال وجواب بإيدك! ارفع ملف إكسل أو رابط صفحتك أو اكتب أسعارك ومقاساتك، والمساعد الذكي هيفهمها ويجاوب العملاء زي أشطر بياع عندك في المحل.
            </p>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>دعم كامل لشيتات Excel و Google Sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تحديث الأسعار والمخزون في الوقت الحقيقي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>قواعد مخصصة للهدايا وكوبونات الخصم</span>
              </div>
            </div>
          </div>

          {/* Simulator Visual Card */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#120F1D] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-gray-200">كتالوج المنتجات الذكي (Product Training Sheet)</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">مُدرب ومتزامن</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>هودي أوفر سايز ميلتون</span>
                <span className="text-purple-400">650 ج.م</span>
                <span className="text-gray-400">M, L, XL</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>كارديجان صوف شتوي</span>
                <span className="text-purple-400">890 ج.م</span>
                <span className="text-gray-400">Free Size</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span>بنطلون وايد ليج جبردين</span>
                <span className="text-purple-400">520 ج.م</span>
                <span className="text-gray-400">30, 32, 34, 36</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Link href="/settings" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-300 transition">
                إدارة الكتالوج من الإعدادات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Embeddable Web Chat Widget (ويدجت الشات الحي للمواقع ومتاجر سلة وشوبيفاي) */}
      <section id="widget" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-3xl bg-[#120F1D] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-gray-200">كود تضمين الويدجت (Embed Code)</span>
              <span className="text-purple-400">HTML / Next.js / Shopify / Salla</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-purple-300 break-all select-all">
              {widgetCode}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400">انسخ الكود وضعه قبل وسم &lt;/body&gt; في موقعك</span>
              <button
                onClick={copyWidget}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <Code2 size={14} />
                <span>{copiedWidget ? "تم النسخ ✓" : "نسخ الكود"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">✦ تحويل زوار الموقع لعملاء</span>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              ويدجت شات ذكي لموقعك ومتجرك الإلكتروني
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              مش بس إنستجرام وفيسبوك! أضف شات الذكاء الاصطناعي لموقعك الإلكتروني أو متجرك على سلة، زد، وشوبيفاي بكود سطر واحد. يساعد زوارك في اختيار المقاس المناسب، ويقفل الطلب مباشرة.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Shipping & Couriers Integration (تصدير بوالص الشحن التلقائي) */}
      <section id="shipping" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">✦ أتمتة الشحن والتوصيل</span>
          <h2 className="text-3xl lg:text-4xl font-bold">تصدير بوالص الشحن بنقرة زر واحدة</h2>
          <p className="text-gray-400 text-sm mt-3">ربط مباشر مع كبرى شركات الشحن المصرية لتسليم الأوردرات بدون إدخال يدوي</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#120F1D] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              BOSTA
            </div>
            <h3 className="text-lg font-bold">بوسطة (Bosta)</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              إنشاء بوليصة شحن تلقائية مع رقم التتبع فور استخراج بيانات العميل والعنوان من الشات.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#120F1D] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
              ARAMEX
            </div>
            <h3 className="text-lg font-bold">أرامكس (Aramex)</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              توليد ملصقات الشحن المجهزة للشحن المحلي والدولي في الخليج ومطابقة مصاريف التوصيل.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#120F1D] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
              OTO
            </div>
            <h3 className="text-lg font-bold">أوتو للمتاجر (OTO)</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              إسناد الأوردر الذكي لأرخص وأسرع شركة شحن تغطي محافظة ومنطقة العميل آلياً.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section (Exact Replyse Questions Structure) */}
      <section id="questions" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">أسئلة شائعة</h2>
          <p className="text-gray-400 text-sm mt-2">كل ما تريد معرفته عن تشغيل PR Agent في متجرك</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-2xl bg-[#120F1D] border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-right font-bold text-sm flex items-center justify-between text-gray-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed font-light border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call To Action Footer */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-white/10">
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
          خلّي المحادثات تتحرّك. وخليك متابع.
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 font-light">
          ابدأ مع PR Agent اليوم، وجرّب رحلة العميل السلسة من أول رسالة حتى تأكيد الدفع والتوصيل.
        </p>
        <Link 
          href="/inbox" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-purple-400/30"
        >
          <span>ابدأ تجربتك المجانية</span>
          <ArrowUpRight size={18} />
        </Link>
      </section>

      {/* 9. Minimal Footer */}
      <footer className="border-t border-white/10 bg-black/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <Logo size="sm" />
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition">الأسعار</Link>
            <Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition">شروط الخدمة</Link>
            <Link href="/settings" className="hover:text-white transition">الإعدادات</Link>
          </div>
          <div>© 2026 PR Agent. جميع الحقوق محفوظة.</div>
        </div>
      </footer>
    </div>
  );
}
