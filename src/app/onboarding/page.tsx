'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Store, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Layers, 
  Bot, 
  QrCode, 
  Upload, 
  Check, 
  RefreshCw,
  Truck
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { soundFX } from '@/lib/soundFX';
import { toast } from '@/components/ui/Toast';

type Step = 1 | 2 | 3 | 4;

export default function MerchantOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Store & Industry
  const [storeName, setStoreName] = useState('');
  const [industry, setIndustry] = useState<'fashion' | 'beauty' | 'electronics' | 'home' | 'food'>('fashion');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');

  // Step 2: Shipping & Payment Rules
  const [defaultShippingCost, setDefaultShippingCost] = useState('45');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['cod', 'instapay']);
  const [instapayAddress, setInstapayAddress] = useState('');
  const [bostaApiKey, setBostaApiKey] = useState('');

  // Step 3: AI Brand Tone & Rules
  const [aiTone, setAiTone] = useState<'friendly_egyptian' | 'formal_arabic' | 'luxury_concierge'>('friendly_egyptian');
  const [customKnowledge, setCustomKnowledge] = useState('الاستبدال والاسترجاع متاح خلال 14 يوم بشرط وجود التيكت الأصلي. خامات القطن ميلتون تركي 100%.');

  // Step 4: Final Connect State
  const [completedProfile, setCompletedProfile] = useState<any>(null);

  const togglePayment = (method: string) => {
    soundFX.playPop();
    setPaymentMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();

    if (step === 1) {
      if (!storeName.trim() || !phoneNumber.trim()) {
        toast('error', 'يرجى إدخال اسم المتجر ورقم الواتساب للمتابعة');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleSubmitOnboarding();
    }
  };

  const handleSubmitOnboarding = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/merchant/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          industry,
          phoneNumber,
          instagramHandle,
          defaultShippingCost: Number(defaultShippingCost) || 45,
          paymentMethods,
          instapayAddress,
          aiTone,
          bostaApiKey
        })
      });

      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        setCompletedProfile(data.profile);
        setStep(4);
        toast('success', 'تم حفظ وتدريب إيجنت متجرك بنجاح!');
      } else {
        toast('error', data.error || 'تعذر حفظ البيانات');
      }
    } catch (e) {
      toast('error', 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white selection:bg-[#7c3aed] selection:text-white font-sans flex flex-col justify-between p-6" dir="rtl">
      
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-8 border-b border-white/5">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">إعداد المتجر والإيجنت:</span>
          <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
            الخطوة {step} من 4
          </span>
        </div>
      </header>

      {/* Main Wizard Card */}
      <main className="max-w-3xl w-full mx-auto my-8">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 -z-10" />
          {[
            { num: 1, title: 'هوية المتجر والمجال' },
            { num: 2, title: 'الشحن وطرق الدفع' },
            { num: 3, title: 'شخصية الـ AI والسياسات' },
            { num: 4, title: 'ربط القنوات والتشغيل' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5 bg-[#07040D] px-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= s.num 
                  ? 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span className={`text-[11px] font-medium hidden sm:block ${
                step >= s.num ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#110c22] border border-purple-500/20 shadow-2xl relative overflow-hidden">
          
          {/* STEP 1: Store & Industry */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">✦ البداية السريعة</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">عرّفنا على متجرك ومجالك</h2>
                <p className="text-sm text-gray-400">الإيجنت الذكي هيتم تدريبه على مصطلحات مجالك وطبيعة منتجاتك فوراً.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">اسم البراند / المتجر *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: NOIR Apparel أو رويال فاشون"
                    className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">مجال النشاط التجاري (Industry) *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'fashion', label: 'ملابس وأزياء', icon: '👗' },
                      { id: 'beauty', label: 'مستحضرات وتجميل', icon: '✨' },
                      { id: 'electronics', label: 'إلكترونيات وجوالات', icon: '📱' },
                      { id: 'home', label: 'ديكور ومفروشات', icon: '🛋️' },
                      { id: 'food', label: 'مطاعم وأغذية', icon: '🍔' }
                    ].map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          setIndustry(ind.id as any);
                          soundFX.playPop();
                        }}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2.5 ${
                          industry === ind.id
                            ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{ind.icon}</span>
                        <span className="text-xs font-bold">{ind.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-2">رقم الواتساب الأساسي للبيزنس *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="01012345678"
                      className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-2">حساب إنستجرام (اختياري)</label>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="@yourbrand"
                      className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2"
                >
                  <span>التالي: الشحن والدفع</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping & Payment Rules */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">✦ القواعد المالية واللوجستية</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">كيف تستلم أموالك وتشحن بضاعتك؟</h2>
                <p className="text-sm text-gray-400">الإيجنت هيعتمد هذه الأسعار مباشرة عند الرد على الزبائن.</p>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">طرق الدفع المدعومة في متجرك</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'instapay', label: 'إنستاباي (فحص آلي)', badge: 'Vision OCR' },
                      { id: 'cod', label: 'الدفع عند الاستلام (COD)', badge: 'شائع' },
                      { id: 'vodafone_cash', label: 'فودافون كاش ومحافظ', badge: 'كاش' }
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => togglePayment(pm.id)}
                        className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          paymentMethods.includes(pm.id)
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                            : 'bg-white/5 border-white/5 text-gray-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white mb-1">{pm.label}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-medium">{pm.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethods.includes('instapay') && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <label className="text-xs font-bold text-emerald-300 block">عنوان إنستاباي (IPA / Phone) الخاص بك *</label>
                    <input
                      type="text"
                      value={instapayAddress}
                      onChange={(e) => setInstapayAddress(e.target.value)}
                      placeholder="username@instapay أو 010xxxxxxxx"
                      className="w-full h-11 rounded-xl bg-black/50 border border-emerald-500/40 px-4 text-sm text-white focus:outline-none font-mono"
                    />
                    <span className="text-[11px] text-gray-400 block">
                      💡 سيقوم الإيجنت بإرساله للعميل تلقائياً وفحص السكرين شوت ومطابقة رقم العملية.
                    </span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-2">سعر الشحن القياسي (ج.م)</label>
                    <input
                      type="number"
                      value={defaultShippingCost}
                      onChange={(e) => setDefaultShippingCost(e.target.value)}
                      placeholder="45"
                      className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-2">مفتاح ربط بوسطة (Bosta API Key) اختياري</label>
                    <input
                      type="text"
                      value={bostaApiKey}
                      onChange={(e) => setBostaApiKey(e.target.value)}
                      placeholder="bst_live_..."
                      className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all"
                >
                  الرجوع
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2"
                >
                  <span>التالي: سياسات ونبرة الـ AI</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: AI Brand Tone & Knowledge */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">✦ ذكاء البراند المخصص</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">كيف يتحدث الإيجنت مع زبائنك؟</h2>
                <p className="text-sm text-gray-400">حدد اللهجة والتعليمات التي سيلتزم بها المساعد 100%.</p>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">نبرة الحديث (Tone of Voice)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'friendly_egyptian', label: 'عامية مصرية ودودة وسريعة', desc: 'مناسبة للملابس والترندات والشباب 👕' },
                      { id: 'formal_arabic', label: 'عربية فصحى مهنية', desc: 'مناسبة للمنتجات الطبية والتقنية 💼' },
                      { id: 'luxury_concierge', label: 'أسلوب راقي وVIP', desc: 'مناسبة للبراندات الفاخرة والعطور 💎' }
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => {
                          setAiTone(tone.id as any);
                          soundFX.playPop();
                        }}
                        className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          aiTone === tone.id
                            ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold text-white mb-1">{tone.label}</span>
                        <span className="text-[11px] text-gray-400 leading-relaxed">{tone.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-2">تعليمات وسياسات إضافية (Store Knowledge)</label>
                  <textarea
                    rows={4}
                    value={customKnowledge}
                    onChange={(e) => setCustomKnowledge(e.target.value)}
                    placeholder="اكتب هنا أي معلومات خاصة بالخامة، أوقات العمل، سياسة الاسترجاع..."
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-4 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all"
                >
                  الرجوع
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin text-black" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  <span>حفظ وتوليد الإيجنت المتخصص</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Live Channel Connect */}
          {step === 4 && completedProfile && (
            <div className="space-y-6 text-center animate-fade-in py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  مبروك! إيجنت <span className="text-emerald-400">{completedProfile.storeName}</span> جاهز للعمل 🚀
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  تم حفظ بيانات مجالك وقواعد الشحن والدفع وتدريب الإيجنت بنجاح. الخطوة الأخيرة هي ربط رقم الواتساب أو صفحة إنستجرام ليبدأ الرد فوراً.
                </p>
              </div>

              {/* Profile Summary Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-right text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">كود المستأجر (Tenant ID):</span>
                  <span className="font-mono text-purple-300 font-bold">{completedProfile.tenantId || 'TENANT-994201'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">مجال المتجر:</span>
                  <span className="text-white font-medium">{completedProfile.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">حساب إنستاباي المعتمد:</span>
                  <span className="font-mono text-emerald-400 font-bold">{completedProfile.instapayAddress}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/channels"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2"
                >
                  <QrCode size={18} />
                  <span>ربط الواتساب الآن (Scan QR)</span>
                </Link>
                <Link
                  href="/inbox"
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all flex items-center gap-2"
                >
                  <span>الدخول لصندوق المحادثات</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 pt-8">
        PR Agent Enterprise · تشفير بيانات كامل متوافق مع معايير الأمان المصرفية وحماية الخصوصية.
      </footer>
    </div>
  );
}
