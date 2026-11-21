"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  Bot, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ChevronDown, 
  ArrowUpRight,
  Code2
} from "lucide-react";
import { InteractivePhoneTour } from "@/components/InteractivePhoneTour";

export default function LandingPage() {
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
    <div className="min-h-screen bg-[#0f1011] text-[#ffffff] selection:bg-[#d3fd50] selection:text-[#0f1011] font-sans antialiased" dir="rtl">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-white/5 bg-[#0f1011]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo size="md" />
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#9ca3af]">
              <a href="#interactive-demo" className="hover:text-white transition">شاهد المحاكاة الحية</a>
              <a href="#simulator" className="hover:text-white transition">تعليم الكتالوج</a>
              <a href="#widget" className="hover:text-white transition">ويدجت الموقع</a>
              <a href="#shipping" className="hover:text-white transition">بوالص الشحن</a>
              <a href="#questions" className="hover:text-white transition">أسئلة شائعة</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#9ca3af] hover:text-white transition px-3 py-1.5 font-medium">
              دخول
            </Link>
            <Link 
              href="/onboarding" 
              className="px-6 py-2.5 rounded-xl bg-[#d3fd50] hover:bg-[#c4ee3e] text-[#0f1011] font-black text-xs transition-all shadow-[0_0_25px_rgba(211,253,80,0.35)] flex items-center gap-2"
            >
              <span>تجربة مجانية 3 أيام</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1b1e] border border-white/10 text-[#d3fd50] text-xs font-bold">
              <Sparkles size={14} className="text-[#d3fd50]" />
              <span>مساعد المبيعات الذكي الأول للتجارة والعقارات في مصر</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.15] text-white">
              من أول استفسار، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3fd50] via-white to-[#8b5cf6]">
                لطلب مؤكد مدفوع وبوليصة شحن.
              </span>
            </h1>

            <p className="text-lg text-[#9ca3af] font-normal leading-relaxed max-w-xl">
              إيجنت ذكاء اصطناعي فاهم اللهجة المصرية والعربية، يجمع قنواتك (واتساب، إنستجرام، فيسبوك)، ويدقق إيصالات إنستاباي ويسترجع السلات المهجورة ذاتياً.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/onboarding" 
                className="px-8 py-4 rounded-xl bg-[#d3fd50] hover:bg-[#c4ee3e] text-[#0f1011] font-black text-sm transition-all shadow-[0_0_30px_rgba(211,253,80,0.4)] flex items-center gap-2"
              >
                <span>ابدأ الـ 3 أيام تجربة مجاناً</span>
                <ArrowLeft size={18} />
              </Link>
              <a 
                href="#interactive-demo" 
                className="px-6 py-4 rounded-xl bg-[#1a1b1e] hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <Play size={16} className="text-[#d3fd50] fill-[#d3fd50]" />
                <span>شاهد المحاكاة الحية</span>
              </a>
            </div>
          </div>

          {/* Hero Side Preview Box */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 text-xs text-[#9ca3af]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d3fd50] animate-pulse"></span>
                <span className="text-white font-bold">رد آلي فوري مباشر</span>
              </span>
              <span className="font-mono text-[#8b5cf6]">WhatsApp & Instagram Live</span>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0f1011] border border-white/5 text-right space-y-1">
                <span className="text-[10px] text-[#9ca3af]">العميل على إنستجرام:</span>
                <p className="text-white font-medium">لو سمحت الفستان البيج متاح مقاس M؟ وسعر الشحن للإسكندرية كام؟</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-right space-y-1 mr-4">
                <span className="text-[10px] text-[#d3fd50] flex items-center gap-1 font-bold">
                  <Bot size={12} /> PR Agent (رد خلال ثانيتين):
                </span>
                <p className="text-white font-medium">أهلاً بحضرتك يا فندم! 🌸 نعم الفستان البيج متاح مقاس M وخامة الكتان الصافي بسعر 850 ج.م، والشحن للإسكندرية 45 ج.م ويوصلك بعد بكرة. تحبي نأكد الطلب لحضرتك؟</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1b1e] border border-[#d3fd50]/30 text-[#d3fd50] flex items-center justify-between font-bold">
                <span>تم تسجيل الأوردر في الـ Pipeline تلقائياً</span>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Phone Simulation Tour */}
      <section id="interactive-demo" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <InteractivePhoneTour />
      </section>

      {/* 4. AI Training Simulator */}
      <section id="simulator" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#d3fd50] uppercase tracking-wider block">✦ تدريب فوري بضغطة زر</span>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight text-white">
              علّم الإيجنت منتجاتك وسياساتك في دقيقتين فقط
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              مش محتاج تسجل كل سؤال وجواب بإيدك! ارفع ملف إكسل أو رابط صفحتك أو اكتب أسعارك ومقاساتك، والمساعد الذكي هيفهمها ويجاوب العملاء زي أشطر بياع عندك في المحل.
            </p>
            <div className="space-y-3 text-xs text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d3fd50]" />
                <span>دعم كامل لشيتات Excel و Google Sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d3fd50]" />
                <span>تحديث الأسعار والمخزون في الوقت الحقيقي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d3fd50]" />
                <span>قواعد مخصصة للهدايا وكوبونات الخصم وتأهيل العقارات</span>
              </div>
            </div>
          </div>

          {/* Simulator Visual Card */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
              <span className="font-bold text-white">كتالوج المنتجات الذكي (Product Training Sheet)</span>
              <span className="text-[#d3fd50] bg-white/5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#d3fd50]/30">مُدرب ومتزامن</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0f1011] border border-white/5 flex items-center justify-between text-white">
                <span>هودي أوفر سايز ميلتون</span>
                <span className="text-[#d3fd50] font-bold">650 ج.م</span>
                <span className="text-[#9ca3af]">M, L, XL</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0f1011] border border-white/5 flex items-center justify-between text-white">
                <span>كارديجان صوف شتوي</span>
                <span className="text-[#d3fd50] font-bold">890 ج.م</span>
                <span className="text-[#9ca3af]">Free Size</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0f1011] border border-white/5 flex items-center justify-between text-white">
                <span>شقة 180م التجمع الخامس (عقارات)</span>
                <span className="text-[#8b5cf6] font-bold">مقدم 10%</span>
                <span className="text-[#9ca3af]">تسليم 2026</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Link href="/catalog" className="px-4 py-2 rounded-xl bg-[#0f1011] hover:bg-white/10 border border-white/10 text-xs font-bold text-[#8b5cf6] transition">
                إدارة الكتالوج من لوحة التحكم
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Embeddable Web Chat Widget */}
      <section id="widget" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
              <span className="font-bold text-white">كود تضمين الويدجت (Embed Code)</span>
              <span className="text-[#d3fd50] font-mono">HTML / Next.js / Shopify / Salla</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0f1011] border border-white/10 font-mono text-xs text-[#8b5cf6] break-all select-all">
              {widgetCode}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#9ca3af]">انسخ الكود وضعه قبل وسم &lt;/body&gt; في موقعك</span>
              <button
                onClick={copyWidget}
                className="px-4 py-2 rounded-xl bg-[#d3fd50] hover:bg-[#c4ee3e] text-[#0f1011] text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-[#d3fd50]/20"
              >
                <Code2 size={14} />
                <span>{copiedWidget ? "تم النسخ ✓" : "نسخ الكود"}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold text-[#d3fd50] uppercase tracking-wider block">✦ تحويل زوار الموقع لعملاء</span>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight text-white">
              ويدجت شات ذكي لموقعك ومتجرك الإلكتروني
            </h2>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              مش بس إنستجرام وفيسبوك! أضف شات الذكاء الاصطناعي لموقعك الإلكتروني أو متجرك على سلة، زد، وشوبيفاي بكود سطر واحد. يساعد زوارك في اختيار المقاس المناسب، ويقفل الطلب مباشرة.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Shipping & Couriers Integration */}
      <section id="shipping" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#d3fd50] uppercase tracking-wider block mb-2">✦ أتمتة الشحن والتوصيل</span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">تصدير بوالص الشحن بنقرة زر واحدة</h2>
          <p className="text-[#9ca3af] text-sm mt-3">ربط مباشر مع كبرى شركات الشحن المصرية لتسليم الأوردرات بدون إدخال يدوي</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f1011] border border-white/10 text-[#d3fd50] flex items-center justify-center font-black text-lg">
              BOSTA
            </div>
            <h3 className="text-lg font-bold text-white">بوسطة (Bosta)</h3>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              إنشاء بوليصة شحن تلقائية مع رقم التتبع فور استخراج بيانات العميل والعنوان من الشات.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f1011] border border-white/10 text-[#8b5cf6] flex items-center justify-center font-black text-lg">
              ARAMEX
            </div>
            <h3 className="text-lg font-bold text-white">أرامكس (Aramex)</h3>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              توليد ملصقات الشحن المجهزة للشحن المحلي والدولي في الخليج ومطابقة مصاريف التوصيل.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1a1b1e] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f1011] border border-white/10 text-white flex items-center justify-center font-black text-lg">
              OTO
            </div>
            <h3 className="text-lg font-bold text-white">أوتو للمتاجر (OTO)</h3>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              إسناد الأوردر الذكي لأرخص وأسرع شركة شحن تغطي محافظة ومنطقة العميل آلياً.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="questions" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">أسئلة شائعة</h2>
          <p className="text-[#9ca3af] text-sm mt-2">كل ما تريد معرفته عن تشغيل PR Agent في متجرك</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-2xl bg-[#1a1b1e] border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-right font-bold text-sm flex items-center justify-between text-white hover:text-[#d3fd50] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#8b5cf6] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#9ca3af] leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call To Action Footer */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-white/5">
        <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">
          خلّي المحادثات تتحرّك. وخليك متابع.
        </h2>
        <p className="text-[#9ca3af] text-sm max-w-xl mx-auto mb-8">
          ابدأ مع PR Agent اليوم، وجرّب رحلة العميل السلسة من أول رسالة حتى تأكيد الدفع والتوصيل.
        </p>
        <Link 
          href="/onboarding" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#d3fd50] hover:bg-[#c4ee3e] text-[#0f1011] font-black text-base transition-all shadow-[0_0_30px_rgba(211,253,80,0.4)]"
        >
          <span>ابدأ تجربتك المجانية لمدة 3 أيام</span>
          <ArrowUpRight size={18} />
        </Link>
      </section>

      {/* 9. Minimal Footer */}
      <footer className="border-t border-white/5 bg-[#0f1011] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9ca3af]">
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
