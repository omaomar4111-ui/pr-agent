'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  Bot,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlowingSpotlightCard } from '@/components/GlowingSpotlightCard';

export default function CommentToDmPage() {
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [userName, setUserName] = useState('Sara_Ahmed99');
  const [commentText, setCommentText] = useState('بكام الفستان ده ومتاح منه مقاس L؟');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: 'post-9081',
          commentId: `cmt-${Date.now()}`,
          userName,
          commentText,
          platform
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#e1306c', '#a855f7', '#3b82f6']
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
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
              محرك الرد على التعليقات وتحويلها لشات (Comment-to-DM)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-mono">
              Replyse Meta Funnel
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            رد فوري تلقائي على كومنتات الإعلانات والمنشورات + إرسال رسالة خاصة (DM) فورا بالأسعار لإغلاق الطلب.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium transition"
        >
          <ArrowRight size={14} /> لوحة التحكم
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        {/* Test Simulator */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-slate-100 pb-3 border-b border-white/5 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            محاكي تعليقات العملاء (Live Comment Tester)
          </h2>

          <form onSubmit={handleTestComment} className="space-y-5 mt-5">
            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">المنصة</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform('instagram')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                    platform === 'instagram' 
                      ? 'bg-pink-600/20 border-pink-500 text-pink-300' 
                      : 'bg-white/[0.02] border-white/10 text-slate-400'
                  }`}
                >
                  <MessageCircle size={16} /> Instagram Direct & Posts
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('facebook')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                    platform === 'facebook' 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                      : 'bg-white/[0.02] border-white/10 text-slate-400'
                  }`}
                >
                  <MessageSquare size={16} /> Facebook Pages & Posts
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">اسم العميل / المعرّف</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5 font-medium">نص التعليق على البوست</label>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-90 text-xs font-bold text-white transition shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Bot size={14} />
              )}
              {isProcessing ? 'جاري التحليل وإرسال الردود...' : 'محاكاة التعليق وتفعيل الـ AI'}
            </button>
          </form>
        </div>

        {/* Live Simulation Output */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-slate-200 pb-3 border-b border-white/5">
              النتيجة الحية (Public Reply + Private DM)
            </h3>

            {!result ? (
              <div className="p-8 text-center text-xs text-slate-500">
                اضغط على زر المحاكاة لمعاينة رد الكومنت ورسالة الـ DM الفورية
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {/* Step 1: Public Reply */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-pink-400">
                    <span>1. الرد العام على الكومنت (Public Comment Reply)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Done (0.4s)</span>
                  </div>
                  <p className="text-xs text-slate-200 bg-white/5 p-3 rounded-lg border border-white/5">
                    {result.autoActions.publicReplyText}
                  </p>
                </div>

                {/* Step 2: Private DM */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-purple-300">
                    <span>2. الرسالة الخاصة المرسلة في الـ DM للبيع الفوري</span>
                    <span className="text-[10px] font-mono text-emerald-400">Direct Message Sent</span>
                  </div>
                  <div className="text-xs text-slate-100 bg-[#160d2b] p-3 rounded-lg border border-purple-500/20 whitespace-pre-wrap leading-relaxed">
                    {result.autoActions.privateDmText}
                  </div>
                </div>

                {/* Step 3: Inbox Sync */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
                  <span>تم فتح محادثة جديدة تلقائياً في صندوق المحادثات الموحد</span>
                  <Link href="/inbox" className="text-white underline font-bold flex items-center gap-1">
                    فتح الـ Inbox <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
