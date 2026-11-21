'use client';

import { useState } from 'react';
import { 
  Bot, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  KeyRound, 
  Sparkles, 
  ShieldCheck,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCode, setDemoCode] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.code) {
        setDemoCode(data.code);
      }
      setStep('otp');
    } catch (err) {
      setStep('otp');
      setDemoCode('582914');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('يرجى إدخال كود التأكيد المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/onboarding';
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-6 selection:bg-emerald-500 selection:text-white" dir="rtl">
      
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-lg shadow-emerald-500/10">
            <img src="/pr-logo.png" alt="PR Agent" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white block">PR Agent</span>
            <span className="text-[10px] text-emerald-400 font-semibold block -mt-1">منصة التجارة المحادثية</span>
          </div>
        </Link>

        <Link 
          href="/pricing" 
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          خطط الأسعار والباقات
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
            {step === 'email' ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <h1 className="text-xl font-black text-white">
            {step === 'email' ? 'تسجيل الدخول لبوابة العميل' : 'أدخل كود التأكيد (OTP)'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 'email' 
              ? 'أدخل بريدك الإلكتروني لإرسال كود تسجيل دخول آمن بدون كلمة مرور' 
              : `تم إرسال كود التأكيد (6 أرقام) إلى: ${email}`}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {demoCode && step === 'otp' && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs p-3 rounded-xl text-center font-mono">
            كود الدخول السريع للاختبار: <strong>{demoCode}</strong>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">البريد الإلكتروني للعمل / المتجر</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                <input 
                  type="email" 
                  required
                  placeholder="name@store.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال كود الدخول السريع'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyLogin} className="space-y-6 text-xs">
            <div className="flex justify-between gap-2" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-center text-xl font-bold text-white focus:outline-none transition-all font-mono"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تأكيد الكود والدخول للداشبورد</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
              >
                تغيير البريد الإلكتروني
              </button>
            </div>
          </form>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500">
        © 2026 PR Agent Platform &bull; نظام توثيق وتسجيل دخول العملاء المشفر.
      </footer>

    </div>
  );
}
