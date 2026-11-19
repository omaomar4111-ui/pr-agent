"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  Bot, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Play, 
  Pause, 
  Sliders, 
  Activity, 
  MessageSquare,
  Lock,
  ArrowRight,
  Send,
  Eye,
  RefreshCw,
  Users
} from "lucide-react";

interface AgentBot {
  id: string;
  name: string;
  avatar: string;
  role: string;
  model: string;
  status: "idle" | "running" | "waiting_approval";
  environment: string; // Isolated VM or Cloud Workspace (OpenMausBot style)
  successRate: string;
  handledCount: number;
  currentTask: string;
  permissions: {
    canAutoApproveDiscount: boolean;
    canDispatchOrder: boolean;
    canVerifyInstaPay: boolean;
  };
  logFeed: string[];
}

export default function OpenMausFleetPage() {
  const [agents, setAgents] = useState<AgentBot[]>([
    {
      id: "agent-1",
      name: "سارة طارق (Sarah Closer)",
      avatar: "👩‍💼",
      role: "Sales & Entity Extraction Lead",
      model: "Groq / Llama 3.1 8B Instant",
      status: "running",
      environment: "vm-sandbox-sales-01",
      successRate: "97.4%",
      handledCount: 1420,
      currentTask: "تتفاوض مع عميل إنستجرام وتستخرج عنوان التوصيل بالمعادي",
      permissions: { canAutoApproveDiscount: true, canDispatchOrder: false, canVerifyInstaPay: false },
      logFeed: [
        "[17:34:02] استلام رسالة: 'متاح مقاس L من الهودي الأسود؟'",
        "[17:34:03] تأكيد التوفر وعرض كود خصم الشحن المجاني",
        "[17:34:10] العميل وافق وجاري طلب العنوان ورقم الهاتف"
      ]
    },
    {
      id: "agent-2",
      name: "كريم ممدوح (Karim Auditor)",
      avatar: "🔍",
      role: "Forensic InstaPay Vision Auditor",
      model: "Google Gemini 1.5 Flash Vision",
      status: "waiting_approval",
      environment: "vm-sandbox-security-ocr",
      successRate: "99.8%",
      handledCount: 890,
      currentTask: "تحليل إيصال تحويل 1,300 ج.م على إنستاباي - يتطلب موافقة المدير",
      permissions: { canAutoApproveDiscount: false, canDispatchOrder: false, canVerifyInstaPay: true },
      logFeed: [
        "[17:35:12] استلام سكرين شوت تحويل إنستاباي (1.2 MB)",
        "[17:35:14] Vision OCR: استخراج رقم العملية TXN-98421049 والمبلغ 1,300 ج.م",
        "[17:35:15] فحص البكسلات ومطابقة الحساب البنكي: سليم بنسبة 99%",
        "[17:35:16] تم تعليق الإجراء بانتظار موافقة المشرف البشري (Permission Broker)"
      ]
    },
    {
      id: "agent-3",
      name: "منى زاهر (Mona Hunter)",
      avatar: "⚡",
      role: "Instagram Comment-to-DM Specialist",
      model: "Groq / Llama 3.1 8B",
      status: "running",
      environment: "vm-sandbox-meta-relay",
      successRate: "98.2%",
      handledCount: 2310,
      currentTask: "مراقبة تعليقات ريلز الجمعة البيضاء وإرسال رسائل في الـ DM",
      permissions: { canAutoApproveDiscount: true, canDispatchOrder: false, canVerifyInstaPay: false },
      logFeed: [
        "[17:36:00] رصد تعليق: 'بكام الفستان الصوف؟'",
        "[17:36:01] إرسال رد على التعليق: 'تم الرد في الخاص 📩'",
        "[17:36:02] فتح محادثة DM وإرسال الكتالوج وكود الخصم"
      ]
    },
    {
      id: "agent-4",
      name: "هاني فؤاد (Hany Dispatcher)",
      avatar: "🚚",
      role: "Logistics & Courier Dispatcher",
      model: "Local Deterministic Core",
      status: "idle",
      environment: "vm-sandbox-bosta-api",
      successRate: "100%",
      handledCount: 650,
      currentTask: "في وضع الاستعداد لتوليد بوالص شحن بوسطة وأرامكس",
      permissions: { canAutoApproveDiscount: false, canDispatchOrder: true, canVerifyInstaPay: false },
      logFeed: [
        "[17:30:10] توليد بوليصة Bosta #BST-90812 بنجاح",
        "[17:30:11] إرسال رقم التتبع للعميل عبر واتساب",
        "[17:31:00] الانتقال لوضع الاستعداد (Idle)"
      ]
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState("agent-2");
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // OpenMausBot Permission Approval Handlers
  const handleApproveAction = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: "running",
          currentTask: "تم اعتماد العملية من المشرف ✓ وجاري تسجيل الأوردر للشحن",
          logFeed: [...a.logFeed, `[${new Date().toLocaleTimeString('ar-EG')}] موافقة بشرية: تم اعتماد الإجراء بنجاح (Approved by Admin)`]
        };
      }
      return a;
    }));
  };

  const handleDenyAction = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          status: "idle",
          currentTask: "تم رفض العملية من المشرف وتنبيه العميل",
          logFeed: [...a.logFeed, `[${new Date().toLocaleTimeString('ar-EG')}] رفض بشري: تم رفض الإجراء من المشرف (Denied by Admin)`]
        };
      }
      return a;
    }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#07050d] text-white font-sans selection:bg-[#7c3aed] flex flex-col">
      {/* Top Header */}
      <header className="border-b border-[#a855f7]/20 bg-[#100c1c]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="text-gray-500 font-mono">/</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-200">OpenMaus Multi-Agent Workspace</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono">
              Local-First & Supervised
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/inbox" className="text-xs text-gray-300 hover:text-white transition">صندوق الوارد الموحد</Link>
          <Link href="/pipeline" className="text-xs text-gray-300 hover:text-white transition">إدارة الطلبات (CRM)</Link>
          <Link href="/settings" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-4 py-2 rounded-xl transition">
            إعدادات البيئة
          </Link>
        </div>
      </header>

      {/* Main Workspace Split (OpenMausBot Desktop Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Right Sidebar: Agent Contacts Roster */}
        <aside className="w-80 lg:w-96 border-l border-[#a855f7]/20 bg-[#0B0B0D]/80 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              <span>فريق البوتات (Agent Roster)</span>
            </span>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              {agents.filter(a => a.status === "running").length} نشط الآن
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-3 space-y-2">
            {agents.map(bot => {
              const isSelected = selectedAgentId === bot.id;
              return (
                <div
                  key={bot.id}
                  onClick={() => setSelectedAgentId(bot.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-purple-600/10 border-purple-500/50 shadow-lg shadow-purple-900/30"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="text-2xl p-1 rounded-xl bg-black/40 border border-white/10">
                        {bot.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{bot.name}</h4>
                        <span className="text-[10px] text-gray-400">{bot.role}</span>
                      </div>
                    </div>
                    {/* Status Dot */}
                    {bot.status === "running" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="يعمل الآن" />
                    )}
                    {bot.status === "waiting_approval" && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold animate-pulse">
                        بانتظار موافقة ⚠️
                      </span>
                    )}
                    {bot.status === "idle" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-500" title="في وضع الاستعداد" />
                    )}
                  </div>

                  <p className="text-[11px] text-purple-200/80 truncate font-light mt-1">
                    {bot.currentTask}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>{bot.environment}</span>
                    <span className="text-emerald-400 font-semibold">{bot.successRate} نجاح</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center/Left: Active Bot Execution Console & Permission Broker */}
        <main className="flex-1 flex flex-col bg-[#07050d] overflow-y-auto p-6 space-y-6">
          {selectedAgent && (
            <>
              {/* Agent Hero Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#141024] via-[#1a122e] to-[#100c1c] border border-[#a855f7]/30 shadow-2xl flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-3 rounded-2xl bg-black/50 border border-purple-500/40 shadow-inner">
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>{selectedAgent.name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                        {selectedAgent.model}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{selectedAgent.role} · المعرف البيئي: <span className="font-mono text-purple-300">{selectedAgent.environment}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right pl-4 border-l border-white/10">
                    <span className="text-[10px] text-gray-400 block">المهام المنجزة</span>
                    <span className="text-lg font-bold text-white font-mono">{selectedAgent.handledCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">دقة المعالجة</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{selectedAgent.successRate}</span>
                  </div>
                </div>
              </div>

              {/* OpenMausBot Permission Broker Banner (If Action Needs Human Sign-Off) */}
              {selectedAgent.status === "waiting_approval" && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/50 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-amber-300">مطلوب موافقة المشرف (Human-in-the-Loop Permission Broker)</h3>
                        <p className="text-xs text-gray-300 font-light mt-0.5">
                          قام الإيجنت بتدقيق إيصال إنستاباي بنجاح، ويتطلب النظام تأكيداً بشرياً قبل تسجيل الشحن رسمياً.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
                      High Impact Action
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-gray-300 font-mono space-y-1">
                    <div>• المعاملة: <span className="text-white">تحويل إنستاباي بمبلغ 1,300.00 ج.م</span></div>
                    <div>• الرقم المرجعي: <span className="text-purple-300">TXN-98421049 (غير مكرر)</span></div>
                    <div>• موثوقية الرؤية البصرية: <span className="text-emerald-400">99.8% (Valid Forensic Signature)</span></div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleDenyAction(selectedAgent.id)}
                      className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle size={16} />
                      <span>رفض العملية (Deny)</span>
                    </button>
                    <button
                      onClick={() => handleApproveAction(selectedAgent.id)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={16} />
                      <span>اعتماد وتنفيذ الشحن (Approve)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Bot Execution Terminal / Logs */}
              <div className="p-6 rounded-3xl bg-[#0B0B0D] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <Terminal size={16} className="text-purple-400" />
                    <span>سجل التنفيذ المباشر للإيجنت (Isolated Execution Feed)</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Stream: active</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/80 border border-white/5 font-mono text-xs space-y-2 text-purple-200/90 min-h-[160px]">
                  {selectedAgent.logFeed.map((log, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-emerald-400">➜</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bot Security & Permissions Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold block text-white">إعطاء خصم تلقائي</span>
                    <span className="text-[10px] text-gray-400">ضمن حدود 10% فقط</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedAgent.permissions.canAutoApproveDiscount ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                    {selectedAgent.permissions.canAutoApproveDiscount ? "مفعل" : "معطل"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold block text-white">فحص إيصالات إنستاباي</span>
                    <span className="text-[10px] text-gray-400">Vision OCR Engine</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedAgent.permissions.canVerifyInstaPay ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                    {selectedAgent.permissions.canVerifyInstaPay ? "مفعل" : "معطل"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold block text-white">إصدار بوالص الشحن</span>
                    <span className="text-[10px] text-gray-400">Bosta / Aramex API</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedAgent.permissions.canDispatchOrder ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                    {selectedAgent.permissions.canDispatchOrder ? "مفعل" : "معطل"}
                  </span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
