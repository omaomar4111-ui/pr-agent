"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Sparkles, 
  RefreshCw,
  Phone,
  MapPin,
  Package,
  CreditCard,
  UserCheck,
  Search,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Truck,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
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
  activeAgent: string;
}

interface MessageItem {
  id: string;
  senderType: "customer" | "agent" | "bot";
  content: string;
  time: string;
  read?: boolean;
}

export default function OmnichannelInboxPage() {
  const [filterTab, setFilterTab] = useState<"all" | "open" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConvId, setActiveConvId] = useState("conv-1");
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
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
      activeAgent: "سارة طارق (Sales Closer)"
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
      activeAgent: "أحمد حسني (Address Auditor)"
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
      activeAgent: "PR Sentinel (Auto Pilot)"
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

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isAiTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderType: "agent",
      content: userText,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      read: true
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));
    setInputText("");
    setIsSending(true);
    soundFX.playSend();

    // Simulate AI Copilot analysis
    setTimeout(() => {
      setIsSending(false);
      setIsAiTyping(true);

      setTimeout(() => {
        setIsAiTyping(false);
        const botReply: MessageItem = {
          id: `m-bot-${Date.now()}`,
          senderType: "bot",
          content: "تم توثيق إيصال إنستاباي بنجاح (Conf: 99.4%)، وجاري تصدير بوليصة الشحن مع بوسطة.",
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          read: true
        };
        setMessages((prev) => ({
          ...prev,
          [activeConvId]: [...(prev[activeConvId] || []), botReply]
        }));
        soundFX.playSuccess();
        toast("success", "تمت المعالجة وتحديث حالة الطلب عبر الـ AI");
      }, 1200);
    }, 600);
  };

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
      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Conversation List (Left in RTL = Rightmost Column) */}
        <div className="w-80 md:w-96 border-l border-white/5 bg-[#0a0714] flex flex-col shrink-0">
          {/* Header & Search */}
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100">صندوق المحادثات</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono">
                {conversations.length} نشطة
              </span>
            </div>

            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في المحادثات..."
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
                    filterTab === tab ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "all" ? "الكل" : tab === "open" ? "مفتوح" : tab === "pending" ? "معلق" : "منتهي"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items */}
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
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-mono">
                        {c.channel}
                      </span>
                      {c.unread && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel 2: Message Thread (Center) */}
        <div className="flex-1 flex flex-col bg-[#07040D] overflow-hidden">
          {/* Thread Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0714]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs">
                {activeConv?.customerName.slice(0, 2) || "PR"}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100">{activeConv?.customerName}</h3>
                <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{activeConv?.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                <Bot size={12} /> {activeConv?.activeAgent}
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                اليوم
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isCustomer = msg.senderType === "customer";
              const isBot = msg.senderType === "bot";

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
                        <Sparkles size={11} /> AI Automated Resolution
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

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 w-fit text-xs text-purple-300 animate-pulse">
                <Bot size={14} className="text-purple-400" />
                <span>الذكاء الاصطناعي يقوم بالتحليل والصياغة</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box with Keyboard Shortcut */}
          <div className="p-3 border-t border-white/5 bg-[#0a0714]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اكتب رداً أو دع الوكيل يكمل... (Enter للإرسال)"
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

        {/* Panel 3: Customer Details & Order Dispatch (Right Column in RTL = Leftmost) */}
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
            </div>
          </div>

          {/* Quick Order Dispatch Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">الطلب المكتشف</span>
              <span className="text-[10px] font-mono text-emerald-400">OCR Verified</span>
            </div>
            <p className="text-xs text-slate-300">هودي أسود أوفر سايز (L) × 2</p>
            <div className="text-sm font-bold font-mono text-white">1,300 ج.م</div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs flex items-center justify-center gap-1.5"
              onClick={() => toast("success", "تم تصدير بوليصة شحن بوسطة برقم: BST-99401")}
            >
              <Truck size={14} className="text-purple-400" /> تصدير بوليصة الشحن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
