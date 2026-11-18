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
  Camera,
  Film,
  Sliders,
  Maximize2
} from 'lucide-react';

export const metadata = {
  title: 'PR Agent | Dark Luxury Cyber-Cinema Platform',
  description: 'منصة الذكاء الاصطناعي الفاخرة لأتمتة مبيعات الشات والتجارة الاجتماعية بهندسة بصرية سيبرانية متقدمة.',
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PR Agent",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "650", "priceCurrency": "EGP" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "240" }
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-white selection:bg-[#7c3aed] selection:text-white font-sans relative radial-cyber-glow" dir="rtl">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top Cyber-Glass Navbar */}
      <nav className="border-b border-[#a855f7]/20 bg-[#100c1c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/inbox" className="hover:text-purple-300 transition">صندوق التحكم (Inbox)</Link>
            <Link href="/pipeline" className="hover:text-purple-300 transition">مسار الأوردرات (CRM)</Link>
            <Link href="/fleet" className="hover:text-purple-300 transition">أسطول الإيجنتس</Link>
            <Link href="/pricing" className="hover:text-purple-300 transition">الباقات</Link>
            <Link href="/settings" className="hover:text-purple-300 transition">الإعدادات</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/inbox" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 border border-purple-400/30"
            >
              <span>دخول المنصة</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tactical Director HUD Tag */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#8b5cf6]/10 border border-[#a855f7]/30 text-purple-200 text-xs font-semibold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CYBER-CINEMA ENGINE v3.0</span>
            <span className="text-gray-500">|</span>
            <span className="text-[#a855f7]">زمن استجابة &lt; 300ms</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
            ذكاء اصطناعي سيبراني. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
              حوّل كل محادثة إلى إغلاق سينمائي.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            منظومة <strong className="text-white font-bold">PR Agent</strong> الفاخرة تدير تعليقات إنستجرام وشات واتساب، تستخرج بوالص الشحن المصرية، وتدقق إيصالات إنستاباي بنظام الرؤية البصرية الفائقة.
          </p>

          {/* Tactile Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <span className="director-pill hud-badge-emerald">
              <CheckCircle2 size={14} />
              <span>رد لحظي &lt; 3 ثوانٍ</span>
            </span>
            <span className="director-pill">
              <Camera size={14} />
              <span>Vision OCR إنستاباي</span>
            </span>
            <span className="director-pill hud-badge-fuchsia">
              <Share2 size={14} />
              <span>Comment-to-DM أوتوماتيكي</span>
            </span>
            <span className="director-pill hud-badge-amber">
              <Sliders size={14} />
              <span>Multi-LLM 0$ Overhead</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/inbox" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 border border-purple-400/30"
            >
              ابدأ الآن مجاناً <ArrowLeft size={18} />
            </Link>
            <Link 
              href="/pricing" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#100c1c]/80 hover:bg-[#161026] border border-[#a855f7]/30 text-white font-semibold text-base transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              استعراض الباقات (من 650 ج.م)
            </Link>
          </div>
        </div>

        {/* Cinematic Filmstrip & Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* Card 1 */}
          <div className="cyber-glass-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold block mb-1">HUD CONTROL</span>
            <h3 className="text-xl font-bold mb-3 text-white">أسطول الإيجنتس المستقل</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              10 إيجنتس متخصصين يعملون بتناغم: من قناص التعليقات وسارة طارق (Sales Closer) حتى مسؤول استرجاع السلات المتروكة.
            </p>
          </div>

          {/* Card 2 */}
          <div className="cyber-glass-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold block mb-1">FORENSIC VISION</span>
            <h3 className="text-xl font-bold mb-3 text-white">تدقيق إنستاباي والمحافظ بالذكاء البصري</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              فحص جنائي فوري لإيصالات التحويل بالرؤية البصرية لكشف التزوير وتكرار الإيصالات ومطابقة المبلغ خلال ثوانٍ.
            </p>
          </div>

          {/* Card 3 */}
          <div className="cyber-glass-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">ZERO LATENCY</span>
            <h3 className="text-xl font-bold mb-3 text-white">راوتر النماذج الهجين (0$ Overhead)</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              توزيع ديناميكي فوري بين Groq Llama للسرعة الخارقة في اللهجة المصرية وGemini 1.5 للرؤية مع Fallback محلي يضمن تشغيل 100%.
            </p>
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
          <div className="text-xs font-mono text-gray-500">© 2026 PR Agent. Dark Luxury Cyber-Cinema OS.</div>
        </div>
      </footer>
    </div>
  );
}
