import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  CreditCard,
  ShoppingBag,
  Users,
  Sliders,
  Layers,
  FileCheck2,
  PhoneCall,
  Flame
} from 'lucide-react';

export const metadata = {
  title: 'PR Agent',
  description: 'منصة الذكاء الاصطناعي الأولى لأتمتة خدمة العملاء وإغلاق المبيعات لفيسبوك، إنستجرام، وواتساب.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07050d] text-white selection:bg-[#7c3aed] selection:text-white font-sans relative radial-cyber-glow" dir="rtl">
      {/* Top Cyber Navbar */}
      <nav className="border-b border-[#a855f7]/20 bg-[#100c1c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-purple-300 transition">المميزات</Link>
            <Link href="/inbox" className="hover:text-purple-300 transition">صندوق الوارد الموحد</Link>
            <Link href="/pipeline" className="hover:text-purple-300 transition">إدارة الطلبات (CRM)</Link>
            <Link href="/fleet" className="hover:text-purple-300 transition">أسطول الإيجنتس</Link>
            <Link href="/pricing" className="hover:text-purple-300 transition">الأسعار</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/inbox" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 border border-purple-400/30"
            >
              <span>ابدأ مجاناً</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Replyse-Inspired + Dark Luxury Cyber Styling) */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#8b5cf6]/10 border border-[#a855f7]/30 text-purple-200 text-xs font-semibold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>بديل Replyse الفاخر بالذكاء الاصطناعي المصري</span>
            <span className="text-gray-500">|</span>
            <span className="text-[#a855f7]">سرعة رد &lt; 3 ثوانٍ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
            ردود ذكية للعملاء على <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
              فيسبوك، إنستجرام، وواتساب
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            حوّل كل تعليق ورسالة إلى طلب مؤكد! إيجنت ذكاء اصطناعي فاهم لهجة متاجرك، يرد على الأسعار والمقاسات، يستخرج العناوين وبوالص الشحن، ويدقق إيصالات إنستاباي بنظام الرؤية البصرية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/inbox" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 border border-purple-400/30"
            >
              ابدأ تجربتك المجانية الآن <ArrowLeft size={18} />
            </Link>
            <Link 
              href="/pricing" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#100c1c]/80 hover:bg-[#161026] border border-[#a855f7]/30 text-white font-semibold text-base transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              استعراض خطط الأسعار (من 650 ج.م)
            </Link>
          </div>

          {/* Social Proof Channels Badge */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-gray-400 text-xs">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>رد فوري بدون تأخير 24/7</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>تدقيق إيصالات إنستاباي بالـ AI</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>Comment to DM أوتوماتيكي</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>تعاون كامل مع فريق العمل</span>
            </div>
          </div>
        </div>

        {/* Replyse 4 Core Modules Comparison (Re-engineered in PR Luxury Style) */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {/* Module 1: Smart Auto Reply */}
          <div className="cyber-glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">الرد الآلي الذكي</h3>
            <p className="text-gray-400 leading-relaxed text-xs font-light">
              الرد على استفسارات الأسعار، المقاسات، الألوان، والتوصيل فورياً بناءً على كتالوج منتجاتك وبلهجة مصرية طبيعية.
            </p>
          </div>

          {/* Module 2: Omnichannel Inbox */}
          <div className="cyber-glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/30 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">صندوق وارد موحد</h3>
            <p className="text-gray-400 leading-relaxed text-xs font-light">
              جميع المحادثات من إنستجرام، فيسبوك ماسنجر، وواتساب، وتعليقات البوستات مجمعة في شاشة واحدة دون تشتت.
            </p>
          </div>

          {/* Module 3: Order Management & Pipeline */}
          <div className="cyber-glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">تسجيل وإدارة الطلبات</h3>
            <p className="text-gray-400 leading-relaxed text-xs font-light">
              تحويل المحادثات إلى بوالص شحن منظمة، استخراج العنوان ورقم الهاتف، وتتبع حالة الأوردر عبر لوحة كانبان.
            </p>
          </div>

          {/* Module 4: Human-in-the-Loop Teamwork */}
          <div className="cyber-glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">إدارة وتوزيع فريق العمل</h3>
            <p className="text-gray-400 leading-relaxed text-xs font-light">
              إمكانية إيقاف الذكاء الاصطناعي وتدخل الموظف البشري في أي لحظة مع نظام إسناد المحادثات وإشعارات فورية.
            </p>
          </div>
        </div>

        {/* PR Agent Super-Features (Beyond Replyse) */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-[#100c1c] via-[#1a122e] to-[#100c1c] border border-[#a855f7]/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#ec4899] uppercase tracking-wider block mb-2">✦ الميزة الحصرية التي لا تملكها أي منصة أخرى</span>
              <h3 className="text-2xl font-bold text-white mb-2">تدقيق إيصالات إنستاباي والمحافظ الإلكترونية بالرؤية البصرية (Vision AI)</h3>
              <p className="text-sm text-gray-300 font-light max-w-2xl leading-relaxed">
                حل مشكلة سكرين شوت الدفع المزيفة وتكرار الصور في مصر! يقوم الذكاء الاصطناعي بقراءة بيانات الإيصال ومطابقتها قبل اعتماد الأوردر للشحن.
              </p>
            </div>
            <Link
              href="/inbox"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white text-xs font-bold whitespace-nowrap shadow-lg shadow-pink-500/20 hover:opacity-95 transition"
            >
              جرب فحص الإيصالات في الـ Inbox
            </Link>
          </div>
        </div>
      </main>

      {/* Cyber Footer */}
      <footer className="border-t border-[#a855f7]/20 bg-[#07050d] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          <Logo size="sm" />
          <div className="flex gap-6 text-xs">
            <Link href="/pricing" className="hover:text-purple-300 transition">الأسعار</Link>
            <Link href="/privacy" className="hover:text-purple-300 transition">الخصوصية</Link>
            <Link href="/terms" className="hover:text-purple-300 transition">الشروط</Link>
            <Link href="/settings" className="hover:text-purple-300 transition">الإعدادات</Link>
          </div>
          <div className="text-xs font-mono text-gray-500">© 2026 PR Agent. جميع الحقوق محفوظة.</div>
        </div>
      </footer>
    </div>
  );
}
