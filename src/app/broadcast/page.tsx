'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Gift,
  ArrowRight,
  TrendingUp,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlowingSpotlightCard } from '@/components/GlowingSpotlightCard';
import { NumberTicker } from '@/components/NumberTicker';

export default function BroadcastCampaignsPage() {
  const [campaignName, setCampaignName] = useState('استرجاع سلات ملابس الشتاء - خصم 10%');
  const [targetAudience, setTargetAudience] = useState<'abandoned_carts' | 'all_customers' | 'vip_customers'>('abandoned_carts');
  const [discountCode, setDiscountCode] = useState('WINTER10');
  const [messageTemplate, setMessageTemplate] = useState('أهلاً يا {{name}}! 🌸 لاحظنا إنك سبت الهودي الأوفر سايز في السلة. حجزنالك القطعة ومتاح كوبون خصم {{code}} لمدة ساعتين مع شحن مجاني!');
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setLastResult(null);

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          channel: 'whatsapp',
          targetAudience,
          messageTemplate,
          discountCode,
          includeDiscount: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setLastResult(data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#a855f7', '#ffffff']
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              محرك الحملات وإعادة الاستهداف (WhatsApp Broadcast)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              Replyse Retargeting Pro
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            استرجع السلات المتروكة، أرسل عروض حصرية على واتساب للعملاء بدون حظر الأرقام.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition"
        >
          <ArrowRight size={14} /> لوحة التحكم
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <GlowingSpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">سلات متروكة قابلة للاسترجاع</span>
            <Flame className="text-amber-400" size={18} />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-amber-400">
            <NumberTicker value={47} /> عميل
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            قيمة المبيعات المحتملة: <span className="text-emerald-400 font-mono font-bold">34,500 ج.م</span>
          </div>
        </GlowingSpotlightCard>

        <GlowingSpotlightCard spotlightColor="rgba(168, 85, 247, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">معدل التحويل المتوقع (CR)</span>
            <TrendingUp className="text-purple-400" size={18} />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-purple-400">
            28.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            مبني على أداء حملات الواتساب التفاعلية بالذكاء الاصطناعي
          </div>
        </GlowingSpotlightCard>

        <GlowingSpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">حالة خط WhatsApp Business</span>
            <CheckCircle2 className="text-emerald-400" size={18} />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-emerald-400">
            متصل وآمن 100%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            بروتوكول حماية الأرقام وتوزيع الرسائل التلقائي فعال
          </div>
        </GlowingSpotlightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Creator Form */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-slate-100 pb-3 border-b border-white/5 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            إعداد حملة إعادة الاستهداف الفورية
          </h2>

          <form onSubmit={handleLaunchCampaign} className="space-y-5 mt-5">
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">اسم الحملة (داخلي)</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">الجمهور المستهدف</label>
                <select
                  value={targetAudience}
                  onChange={(e: any) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#110B22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="abandoned_carts">عملاء السلات المتروكة (آخر 24 ساعة) - 47 عميل</option>
                  <option value="vip_customers">العملاء الدائمين (VIP) - 84 عميل</option>
                  <option value="all_customers">جميع العملاء السابقين - 312 عميل</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">كوبون الخصم المحفز</label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                نص الرسالة الذكية (مع المتغيرات التلقائية &#123;&#123;name&#125;&#125; و &#123;&#123;code&#125;&#125;)
              </label>
              <textarea
                rows={4}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                ⚡ الإرسال يتم تدريجياً عبر WhatsApp Cloud API
              </span>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                {isSending ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {isSending ? 'جاري جدولة وإرسال الرسائل...' : 'إطلاق الحملة الآن'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview & Result */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-slate-200 pb-3 border-b border-white/5">
              معاينة شكل الرسالة في الواتساب
            </h3>

            {/* WhatsApp Chat Bubble Simulation */}
            <div className="mt-4 p-4 rounded-xl bg-[#0b141a] border border-[#202c33] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#8696a0]">
                <span>PR Store Bot</span>
                <span>الآن</span>
              </div>
              <div className="p-3 rounded-lg bg-[#005c4b] text-white text-xs leading-relaxed whitespace-pre-wrap">
                {messageTemplate.replace('{{name}}', 'محمد').replace('{{code}}', discountCode)}
              </div>
            </div>
          </div>

          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Check size={16} />
                تمت جدولة الحملة بنجاح!
              </div>
              <p className="text-xs text-slate-300">
                كود الحملة: <span className="font-mono text-emerald-300 font-bold">{lastResult.campaignId}</span>
              </p>
              <p className="text-xs text-slate-300">
                عدد العملاء المستهدفين: <span className="font-mono text-white font-bold">{lastResult.queuedRecipients} عميل</span>
              </p>
              <div className="text-[11px] text-emerald-400/80 pt-1 border-t border-emerald-500/20">
                {lastResult.scheduleInfo}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
