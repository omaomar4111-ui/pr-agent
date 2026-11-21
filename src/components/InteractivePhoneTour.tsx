"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  CheckCheck, 
  Sparkles, 
  Bot, 
  Send, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  ChevronRight, 
  Smartphone, 
  Wifi, 
  Battery, 
  Clock, 
  ArrowLeft,
  Sparkle,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { soundFX } from "@/lib/soundFX";

export type TourStep = "inquiry" | "sizing" | "instapay" | "dispatch";

interface StepConfig {
  id: TourStep;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  accent: "purple" | "emerald";
  description: string;
}

const STEPS: StepConfig[] = [
  {
    id: "inquiry",
    number: "01",
    title: "الاستفسار الفوري ومطابقة الكتالوج",
    subtitle: "رد بالثانية من واقع المخزون الحقيقي بدون تأخير",
    badge: "سرعة < 1.2 ثانية",
    accent: "purple",
    description: "العميل يسأل عن خامة وتوافر هودي أو فستان، المساعد الذكي يطابق الكتالوج لحظياً ويعطيه تفاصيل المقاس واللون والسعر دون انتظار أي موظف."
  },
  {
    id: "sizing",
    number: "02",
    title: "اقتراح المقاس الذكي وكتالوج تفاعلي",
    subtitle: "توصية مقاس دقيقة بناءً على الطول والوزن",
    badge: "AI Size Matcher",
    accent: "purple",
    description: "العميل محتار بين مقاسين؟ المساعد يسأله عن الطول والوزن ويحدد له المقاس المناسب 100% ليقضي تماماً على مشاكل الإرجاع والاستبدال."
  },
  {
    id: "instapay",
    number: "03",
    title: "فحص إنستاباي بالرؤية الجنائية (OCR)",
    subtitle: "كشف الإيصالات المفبركة ومطابقة المرجع والوقت فوراً",
    badge: "100% ضد الاحتيال",
    accent: "emerald",
    description: "العميل يرفع سكرين شوت إنستاباي، خوارزمية Vision AI تقرأ رقم المعاملة المرجعي والتاريخ والمبلغ وتتأكد من عدم تكراره قبل تأكيد الطلب."
  },
  {
    id: "dispatch",
    number: "04",
    title: "إصدار بوليصة بوسطة وربط الشحن",
    subtitle: "تحويل المحادثة لأوردر فوري في بوسطة / أوتو / أرامكس",
    badge: "Bosta AWB جاهزة",
    accent: "emerald",
    description: "بمجرد تأكيد الدفع والعنوان، يتم استخراج بوليصة الشحن التلقائية مع شركة الشحن وإرسال رابط التتبع المباشر للعميل على الواتساب."
  }
];

export function InteractivePhoneTour() {
  const [activeStep, setActiveStep] = useState<TourStep>("inquiry");
  const [selectedSize, setSelectedSize] = useState<"M" | "L" | "XL">("L");
  const [isVerifyingOcr, setIsVerifyingOcr] = useState(false);
  const [isOcrVerified, setIsOcrVerified] = useState(true);

  const handleStepChange = (step: TourStep) => {
    soundFX.playPop();
    setActiveStep(step);
    if (step === "instapay") {
      setIsVerifyingOcr(true);
      setTimeout(() => {
        setIsVerifyingOcr(false);
        setIsOcrVerified(true);
        soundFX.playSuccess();
      }, 900);
    } else if (step === "dispatch") {
      soundFX.playSuccess();
    }
  };

  return (
    <div className="w-full py-12">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side (RTL Right): Step Controller & Senior Explanations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-emerald-500/10 to-transparent border border-purple-500/20 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-white font-bold">محاكاة تفاعلية حية</span>
            <span className="text-gray-400">· جرب الهاتف بنفسك الآن</span>
          </div>

          <h3 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
            المساعد الذكي في <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-emerald-400">
              هاتف العميل الحقيقي
            </span>
          </h3>

          <p className="text-gray-300 text-base leading-relaxed">
            اضغط على أي مرحلة في الأسفل لترى كيف يتحول السؤال العادي على واتساب أو إنستجرام إلى أوردر مؤكد مدفوع وبوليصة شحن جاهزة في ثوانٍ معدودة.
          </p>

          {/* Interactive Step Switcher Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const isEmerald = step.accent === "emerald";
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`text-right p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? isEmerald
                        ? "bg-gradient-to-br from-emerald-950/60 via-[#0e1f18] to-emerald-900/30 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40"
                        : "bg-gradient-to-br from-purple-950/60 via-[#18112b] to-purple-900/30 border-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.25)] ring-1 ring-purple-400/40"
                      : "bg-[#110e1d]/80 hover:bg-[#161226] border-white/5 hover:border-purple-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive 
                        ? isEmerald ? "bg-emerald-400 text-black font-bold" : "bg-purple-500 text-white" 
                        : "bg-white/5 text-gray-400 group-hover:text-purple-300"
                    }`}>
                      {step.number}
                    </span>
                    <span className={`text-[11px] font-medium ${
                      isActive 
                        ? isEmerald ? "text-emerald-300" : "text-purple-300" 
                        : "text-gray-400"
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold transition-colors ${
                    isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">
                    {step.subtitle}
                  </p>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                      isEmerald ? "bg-emerald-400" : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Context of Currently Selected Step */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              activeStep === "instapay" || activeStep === "dispatch"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
            }`}>
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-0.5">تفاصيل الخطوة الفنية:</span>
              <p className="text-xs text-gray-200 leading-relaxed">
                {STEPS.find(s => s.id === activeStep)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (RTL Left): Realistic iPhone 16 Pro Frame */}
        <div className="lg:col-span-6 flex justify-center items-center relative">
          
          {/* Ambient Glow Backdrop (Purple + Cyber Emerald) */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/20 via-pink-600/10 to-emerald-500/20 blur-3xl rounded-full opacity-60 -z-10 pointer-events-none" />

          {/* iPhone 16 Pro Titanium Chassis (Fluid Adaptive Width) */}
          <div className="w-[300px] xs:w-[320px] sm:w-[360px] max-w-[92vw] h-[640px] sm:h-[670px] rounded-[48px] sm:rounded-[52px] bg-[#1a1728] p-[8px] sm:p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.18)] border-[2.5px] sm:border-[3px] border-[#393256] relative overflow-hidden flex flex-col">
            
            {/* Screen Bezel Inset */}
            <div className="w-full h-full rounded-[40px] sm:rounded-[44px] bg-[#0c0a14] overflow-hidden flex flex-col relative border border-white/10 select-none">
              
              {/* iOS Status Bar & Dynamic Island */}
              <div className="h-10 pt-2 px-6 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight z-30 shrink-0">
                <span>9:41</span>
                
                {/* Dynamic Island */}
                <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 px-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[9px] text-purple-300 font-mono">PR Agent</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-300">
                  <Wifi size={12} />
                  <Battery size={13} className="text-emerald-400 fill-emerald-400" />
                </div>
              </div>

              {/* Chat App Header (WhatsApp / IG Business Styling with PR Identity) */}
              <div className="px-4 py-2.5 bg-[#141024]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-500 p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-[#0e0c19] flex items-center justify-center">
                        <Bot size={16} className="text-purple-300" />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0e0c19]"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">NOIR Apparel</span>
                      <ShieldCheck size={13} className="text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span>متصل الآن</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-purple-300 font-mono">رد ذكي لحظي</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
                    AI Active
                  </span>
                </div>
              </div>

              {/* Chat Messages Body (Scrollable Container) */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs font-sans relative bg-[radial-gradient(#1c1633_1px,transparent_1px)] [background-size:16px_16px]">
                
                {/* Date separator */}
                <div className="flex justify-center my-1">
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5 font-mono">
                    اليوم · 9:40 ص
                  </span>
                </div>

                {/* 1. Customer Initial Message */}
                <div className="flex flex-col items-start max-w-[85%] self-start animate-fade-in">
                  <div className="p-3 rounded-2xl rounded-tr-sm bg-[#1e1b30] border border-white/10 text-gray-100 shadow-md space-y-1">
                    <p className="text-[12px] leading-relaxed">
                      صباح الخير 👋 الهودي الأوفرسايز الأسود متاح مقاس L؟ وسعر الشحن للشيخ زايد كام وبيوصل في قد إيه؟
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-gray-400">
                      <span>9:40 ص</span>
                    </div>
                  </div>
                </div>

                {/* 2. PR Agent Reply (Always visible or in Step 1+) */}
                <div className="flex flex-col items-end max-w-[88%] self-end mr-auto animate-fade-in">
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-purple-900/60 via-purple-950/80 to-[#18112c] border border-purple-500/30 text-white shadow-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-bold border-b border-purple-500/20 pb-1">
                      <Bot size={12} className="text-purple-400" />
                      <span>PR Agent AI</span>
                      <span className="text-[9px] text-emerald-400 font-mono">⚡ 1.2s</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-gray-100">
                      صباح النور يا فندم! 🖤 نعم متاح قطن ميلتون 100% ثقيل شتوي بسعر <strong className="text-emerald-300">650 ج.م</strong>.
                    </p>
                    <p className="text-[11px] text-gray-300">
                      🚚 الشحن للشيخ زايد <strong className="text-white">40 ج.م</strong> ويوصلك غداً بإذن الله.
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-purple-300">
                      <span>9:40 ص</span>
                      <CheckCheck size={13} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* STEP 2: Sizing Recommender & Interactive Card */}
                {(activeStep === "sizing" || activeStep === "instapay" || activeStep === "dispatch") && (
                  <div className="space-y-2 animate-slide-up">
                    <div className="flex flex-col items-start max-w-[85%] self-start">
                      <div className="p-2.5 rounded-2xl rounded-tr-sm bg-[#1e1b30] border border-white/10 text-gray-100 text-[11px]">
                        طب أنا طولي 178 سم ووزني 76 كجم.. L هيكون واسع ولا مظبوط؟
                      </div>
                    </div>

                    <div className="flex flex-col items-end max-w-[92%] self-end mr-auto">
                      <div className="p-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-[#1b1535] to-[#140f28] border border-purple-500/40 text-white shadow-xl space-y-2 w-full">
                        <div className="flex items-center justify-between text-[10px] border-b border-purple-500/20 pb-1.5">
                          <span className="text-purple-300 font-bold flex items-center gap-1">
                            <Sparkle size={12} className="text-purple-400" />
                            توصية المقاس الدقيقة
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9px] border border-emerald-500/30">
                            مقاس L مثالي بنسبة 98%
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">اختر مقاسك للتأكيد:</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              {(["M", "L", "XL"] as const).map(size => (
                                <button
                                  key={size}
                                  onClick={() => {
                                    setSelectedSize(size);
                                    soundFX.playPop();
                                  }}
                                  className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                                    selectedSize === size
                                      ? "bg-purple-600 text-white ring-2 ring-purple-400"
                                      : "bg-white/5 text-gray-400 hover:text-white"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                          <span className="text-emerald-400 font-mono font-bold text-xs">
                            650 ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: InstaPay Vision OCR Receipt Verification */}
                {(activeStep === "instapay" || activeStep === "dispatch") && (
                  <div className="space-y-2 animate-slide-up">
                    <div className="flex flex-col items-start max-w-[85%] self-start">
                      <div className="p-2.5 rounded-2xl rounded-tr-sm bg-[#1e1b30] border border-white/10 text-gray-100 text-[11px] space-y-1">
                        <p>تمام حولت 690 ج.م على إنستاباي، وده سكرين التحويل 👇</p>
                        <div className="h-20 w-40 rounded-lg bg-black/60 border border-emerald-500/30 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                          <span className="text-[9px] text-emerald-300 font-bold font-mono">INSTAPAY RECEIPT</span>
                          <span className="text-[10px] text-white font-mono font-bold">EGP 690.00</span>
                          <span className="text-[8px] text-gray-400 font-mono">Ref: #IP-99482103</span>
                          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* PR Agent OCR Verification Card */}
                    <div className="flex flex-col items-end max-w-[92%] self-end mr-auto">
                      <div className="p-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-[#0c1f17] via-[#091a13] to-[#07130e] border border-emerald-500/50 text-white shadow-xl space-y-2 w-full">
                        <div className="flex items-center justify-between text-[10px] border-b border-emerald-500/20 pb-1.5">
                          <span className="text-emerald-300 font-bold flex items-center gap-1">
                            <ShieldCheck size={13} className="text-emerald-400" />
                            فحص الرؤية الجنائية OCR
                          </span>
                          <span className="text-[9px] text-emerald-400 font-mono">
                            {isVerifyingOcr ? "جاري الفحص..." : "✓ تم التحقق"}
                          </span>
                        </div>

                        {isVerifyingOcr ? (
                          <div className="p-2 text-center space-y-1">
                            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                            <span className="text-[10px] text-emerald-300">يتم قراءة الـ Reference ومطابقة الحساب...</span>
                          </div>
                        ) : (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-400">المبلغ المطابق:</span>
                              <span className="text-emerald-300 font-bold font-mono">690.00 ج.م</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-400">رقم التحويل المرجعي:</span>
                              <span className="text-gray-200 font-mono">99482103</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] text-center font-bold">
                              ✓ إيصال سليم 100% وغير مكرر
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Automated Shipping Waybill (Bosta Dispatch) */}
                {activeStep === "dispatch" && (
                  <div className="space-y-2 animate-slide-up">
                    <div className="flex flex-col items-end max-w-[92%] self-end mr-auto">
                      <div className="p-3.5 rounded-2xl rounded-tl-sm bg-gradient-to-br from-[#121a28] to-[#0a111a] border border-blue-500/40 text-white shadow-xl space-y-2.5 w-full">
                        <div className="flex items-center justify-between text-[10px] border-b border-blue-500/20 pb-1.5">
                          <span className="text-blue-300 font-bold flex items-center gap-1">
                            <Truck size={13} className="text-blue-400" />
                            تم إصدار بوليصة الشحن (Bosta)
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px]">
                            AWB Generated
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-400">رقم التتبع:</span>
                            <span className="text-emerald-400 font-mono font-bold">BST-8839210-EG</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-400">موعد التسليم المتوقع:</span>
                            <span className="text-gray-200 font-medium">غداً (خلال 24 ساعة)</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-200 leading-relaxed">
                          ألف مبروك يا فندم! أوردرك اتسجل في بوسطة برقم <strong className="text-blue-300">#NOIR-4021</strong> وهيوصلك رسالة SMS برابط تتبع المندوب أول ما يتحرك.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input Bar (Interactive Simulator) */}
              <div className="p-2.5 bg-[#141024] border-t border-white/10 flex items-center gap-2 shrink-0">
                <div className="flex-1 h-9 rounded-full bg-[#1e1933] border border-white/10 px-3.5 flex items-center justify-between text-gray-400 text-xs">
                  <span className="truncate">
                    {activeStep === "inquiry" && "اكتب سؤال العميل التالي..."}
                    {activeStep === "sizing" && "اكتب مقاسك المفضل..."}
                    {activeStep === "instapay" && "تم رفع إيصال إنستاباي..."}
                    {activeStep === "dispatch" && "الطلب جاهز للشحن الآن ✓"}
                  </span>
                  <ImageIcon size={14} className="text-gray-500" />
                </div>
                <button 
                  onClick={() => {
                    const next: Record<TourStep, TourStep> = {
                      inquiry: "sizing",
                      sizing: "instapay",
                      instapay: "dispatch",
                      dispatch: "inquiry"
                    };
                    handleStepChange(next[activeStep]);
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={14} className="rotate-180" />
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="h-4 flex items-center justify-center shrink-0">
                <div className="w-28 h-1 rounded-full bg-white/30" />
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
