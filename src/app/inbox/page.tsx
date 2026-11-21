"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Phone, 
  User, 
  UserCheck, 
  Search, 
  Check, 
  CheckCheck, 
  Paperclip, 
  Smile, 
  Truck, 
  ExternalLink,
  ChevronLeft,
  Headphones,
  Zap,
  Tag,
  Clock,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { soundFX } from "@/lib/soundFX";

interface ConversationItem {
  id: string;
  customerName: string;
  phone: string;
  channel: "instagram" | "whatsapp" | "web";
  lastMessage: string;
  time: string;
  unread: boolean;
  status: "open" | "pending" | "resolved";
  assignedTo: "ai_bot" | "human_agent";
  agentName: string;
  cartTotal?: number;
  items?: string;
}

interface MessageItem {
  id: string;
  senderType: "customer" | "human" | "bot";
  content: string;
  time: string;
  read?: boolean;
}

export default function SeniorOmnichannelInbox() {
  const [filterTab, setFilterTab] = useState<"all" | "open" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConvId, setActiveConvId] = useState("conv-1");
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: "conv-1",
      customerName: "كريم ممدوح (@kareem_style)",
      phone: "+20 101 234 5678",
      channel: "instagram",
      lastMessage: "تمام انا عايز أطلب قطعتين من الهودي الأسود لارج، وحولت 1,300 على إنستاباي",
      time: "15:42",
      unread: true,
      status: "pending",
      assignedTo: "ai_bot",
      agentName: "سارة طارق (Sales Closer & OCR)",
      cartTotal: 1300,
      items: "هودي أسود أوفر سايز (L) × 2"
    },
    {
      id: "conv-2",
      customerName: "نورهان الشريف",
      phone: "+20 112 987 6543",
      channel: "whatsapp",
      lastMessage: "العنوان بالتفصيل: التجمع الخامس، النرجس 2، فيلا 14",
      time: "14:20",
      unread: false,
      status: "open",
      assignedTo: "human_agent",
      agentName: "أحمد حسني (Human Specialist)",
      cartTotal: 850,
      items: "فستان بيج شتوي (M) × 1"
    },
    {
      id: "conv-3",
      customerName: "محمد السعيد",
      phone: "+20 120 445 8899",
      channel: "whatsapp",
      lastMessage: "تم استلام البوليصة وشكراً جداً على سرعة الشحن",
      time: "11:05",
      unread: false,
      status: "resolved",
      assignedTo: "ai_bot",
      agentName: "PR Sentinel (Auto Pilot)",
      cartTotal: 750,
      items: "تيشيرت أبيض أساسي (XL) × 3"
    }
  ]);

  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({
    "conv-1": [
      {
        id: "m-1",
        senderType: "customer",
        content: "السلام عليكم، عاجبني الهودي الأسود الأوفر سايز، هل متاح مقاس L؟",
        time: "15:35",
        read: true
      },
      {
        id: "m-2",
        senderType: "bot",
        content: "وعليكم السلام يا فندم! 🌸 أهلاً بيك. نعم الهودي الأسود الأوفر سايز متاح حالياً بمقاس L قطن ميلتون معالج 100% بسعر 650 ج.م، والتوصيل متاح خلال 48 ساعة مع كود خصم اليوم للشحن.",
        time: "15:36",
        read: true
      },
      {
        id: "m-3",
        senderType: "customer",
        content: "تمام انا عايز أطلب قطعتين من الهودي الأسود لارج، وحولت 1,300 على إنستاباي ومرفق الإيصال الآن.",
        time: "15:42",
        read: true
      }
    ],
    "conv-2": [
      {
        id: "m-201",
        senderType: "customer",
        content: "العنوان بالتفصيل: التجمع الخامس، النرجس 2، فيلا 14",
        time: "14:20",
        read: true
      }
    ],
    "conv-3": [
      {
        id: "m-301",
        senderType: "customer",
        content: "تم استلام البوليصة وشكراً جداً على سرعة الشحن",
        time: "11:05",
        read: true
      }
    ]
  });

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const currentMessages = messages[activeConvId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isAiTyping]);

  // Toggle Human Handoff vs AI Bot
  const toggleHandoff = () => {
    if (!activeConv) return;
    const isAi = activeConv.assignedTo === "ai_bot";
    const nextAssignment = isAi ? "human_agent" : "ai_bot";
    const nextAgentName = isAi ? "أنت (التدخل البشري مباشر)" : "سارة طارق (الذكاء الاصطناعي)";

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, assignedTo: nextAssignment, agentName: nextAgentName }
          : c
      )
    );
    soundFX.playPop();
    toast(
      isAi ? "info" : "success",
      isAi
        ? "تم إيقاف البوت مؤقتاً؛ أنت الآن تتحكم في المحادثة مباشرة (Human Handoff)"
        : "تم تسليم المحادثة مرة أخرى لوكيل الذكاء الاصطناعي للرد التلقائي"
    );
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderType: activeConv?.assignedTo === "human_agent" ? "human" : "human",
      content: text,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      read: true
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));
    setInputText("");
    setQuickRepliesOpen(false);
    soundFX.playSend();

    // If bot is active, trigger AI follow-up
    if (activeConv?.assignedTo === "ai_bot") {
      setIsSending(true);
      setTimeout(() => {
        setIsSending(false);
        setIsAiTyping(true);

        setTimeout(() => {
          setIsAiTyping(false);
          const botReply: MessageItem = {
            id: `m-bot-${Date.now()}`,
            senderType: "bot",
            content: "تم التحقق من تحويل إنستاباي بنجاح بواسطة Vision OCR! سيتم تجهيز البوليصة للشحن إلى عنوانك فوراً.",
            time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
            read: true
          };
          setMessages((prev) => ({
            ...prev,
            [activeConvId]: [...(prev[activeConvId] || []), botReply]
          }));
          soundFX.playSuccess();
        }, 1200);
      }, 500);
    }
  };

  const quickCannedResponses = [
    "أهلاً بيك يا فندم! متاح الشحن لجميع المحافظات خلال 48 ساعة فقط.",
    "تم استلام وتأكيد تحويل إنستاباي، الأوردر قيد التجهيز الآن مع شركة الشحن.",
    "ممكن تتأكد من رقم الهاتف البديل لتسجيله مع مندوب التوصيل؟",
    "كوبون الخصم كود: PR10 يمنحك خصم 10% فوري عند تأكيد الطلب الآن."
  ];

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filterTab === "all" || c.status === filterTab;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-65px)] bg-[#07040D] text-white flex flex-col font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* 3-Panel Main Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Conversation Roster */}
        <div className="w-80 md:w-96 border-l border-white/5 bg-[#0a0714] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>صندوق المحادثات</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  Live Sync
                </span>
              </h2>
            </div>

            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في المحادثات أو الهواتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/5 text-[11px]">
              {(["all", "open", "pending", "resolved"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 py-1 rounded-lg font-medium transition ${
                    filterTab === tab ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "all" ? "الكل" : tab === "open" ? "مفتوح" : tab === "pending" ? "معلق" : "منتهي"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredConversations.length === 0 ? (
              <EmptyState
                icon={Search}
                title="لا توجد محادثات"
                description="لم يتم العثور على محادثات تطابق معايير البحث الحالية."
              />
            ) : (
              filteredConversations.map((c) => {
                const isActive = c.id === activeConvId;
                const isHuman = c.assignedTo === "human_agent";
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-3.5 cursor-pointer transition ${
                      isActive ? "bg-purple-950/20 border-r-2 border-purple-500" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-100">{c.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate line-clamp-1">{c.lastMessage}</p>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-mono">
                        {c.channel}
                      </span>
                      <span className={`flex items-center gap-1 font-medium ${isHuman ? "text-amber-400" : "text-purple-400"}`}>
                        {isHuman ? <User size={10} /> : <Bot size={10} />}
                        {isHuman ? "وكيل بشري" : "AI Copilot"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel 2: Live Conversation Thread & Handoff Controls */}
        <div className="flex-1 flex flex-col bg-[#07040D] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0714]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">
                {activeConv?.customerName.slice(0, 2) || "PR"}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">{activeConv?.customerName}</h3>
                <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{activeConv?.phone}</span>
              </div>
            </div>

            {/* Seamless Human Handoff Action (Chatbase/ManyChat Architecture) */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeConv?.assignedTo === "human_agent" ? "danger" : "secondary"}
                size="sm"
                onClick={toggleHandoff}
                className="text-xs flex items-center gap-1.5"
              >
                {activeConv?.assignedTo === "human_agent" ? (
                  <>
                    <Bot size={14} className="text-purple-400" />
                    <span>إعادة التشغيل الآلي للـ AI</span>
                  </>
                ) : (
                  <>
                    <Headphones size={14} className="text-amber-400" />
                    <span>تدخل بشري مباشر (Human Handoff)</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="text-center my-1">
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                اليوم
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isCustomer = msg.senderType === "customer";
              const isBot = msg.senderType === "bot";
              const isHuman = msg.senderType === "human";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isCustomer
                        ? "bg-white/[0.05] border border-white/10 text-slate-200 rounded-tr-none"
                        : isBot
                        ? "bg-[#1d1238] border border-purple-500/30 text-purple-100 rounded-tl-none shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                        : "bg-purple-600 text-white rounded-tl-none"
                    }`}
                  >
                    {isBot && (
                      <div className="text-[10px] font-mono text-purple-300 font-bold mb-1 flex items-center gap-1">
                        <Sparkles size={11} /> PR Agent (AI Resolved)
                      </div>
                    )}
                    {isHuman && (
                      <div className="text-[10px] font-mono text-amber-200 font-bold mb-1 flex items-center gap-1">
                        <User size={11} /> رد فريق العمل البشري
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-1 px-1">
                    <span>{msg.time}</span>
                    {!isCustomer && <CheckCheck size={12} className="text-purple-400" />}
                  </div>
                </div>
              );
            })}

            {isAiTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 w-fit text-xs text-purple-300 animate-pulse">
                <Bot size={14} className="text-purple-400" />
                <span>الذكاء الاصطناعي يحلل الطلب ويفحص الإيصال</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar (ManyChat-style Canned Replies) */}
          {quickRepliesOpen && (
            <div className="px-4 py-2 border-t border-white/5 bg-[#0a0714] flex flex-wrap gap-2 animate-slide-up">
              {quickCannedResponses.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qr)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 transition"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-white/5 bg-[#0a0714] space-y-2">
            <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => setQuickRepliesOpen(!quickRepliesOpen)}
                className="flex items-center gap-1 hover:text-purple-300 transition"
              >
                <Zap size={12} className="text-purple-400" />
                <span>الردود السريعة الجاهزة (Canned Responses)</span>
              </button>
              <span>اضغط Enter للإرسال السريع</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  activeConv?.assignedTo === "human_agent"
                    ? "اكتب رداً كوكيل بشري مباشر..."
                    : "اكتب رداً أو دع الوكيل يكمل آلياً..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSending}
                className="text-xs px-4"
              >
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>

        {/* Panel 3: Senior Customer Dossier & Instant Dispatch */}
        <div className="w-80 border-r border-white/5 bg-[#0a0714] p-5 hidden lg:flex flex-col space-y-6 overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-100 pb-2 border-b border-white/5">ملف العميل وسجل الطلبات</h4>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">الاسم:</span>
                <span className="font-bold text-slate-200">{activeConv?.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">الهاتف:</span>
                <span className="font-mono text-slate-200" dir="ltr">{activeConv?.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">القناة:</span>
                <span className="font-mono text-purple-400 uppercase">{activeConv?.channel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">حالة الإسناد:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeConv?.assignedTo === "human_agent" ? "بشري" : "AI"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Order Dispatch Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">تفاصيل الطلب النشط</span>
              <span className="text-[10px] font-mono text-emerald-400">Vision OCR Verified</span>
            </div>
            <p className="text-xs text-slate-300">{activeConv?.items}</p>
            <div className="text-sm font-bold font-mono text-white">{activeConv?.cartTotal} ج.م</div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs flex items-center justify-center gap-1.5"
              onClick={() => {
                soundFX.playSuccess();
                toast("success", "تم تصدير بوليصة شحن بوسطة برقم: BST-99401");
              }}
            >
              <Truck size={14} className="text-purple-400" /> تصدير بوليصة الشحن بنقرة زر
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
