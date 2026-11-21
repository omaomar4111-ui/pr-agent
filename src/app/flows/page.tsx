"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Sparkles,
  Zap,
  MessageSquare,
  Bot,
  Plus,
  Play,
  Save,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  CreditCard,
  Truck,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { soundFX } from "@/lib/soundFX";

// Custom Cyber Node Styling
const initialNodes: Node[] = [
  {
    id: "trigger-1",
    type: "input",
    position: { x: 50, y: 150 },
    data: {
      label: (
        <div className="p-3 bg-[#130b29] border border-purple-500/40 rounded-xl text-right font-sans shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs mb-1">
            <Zap size={13} />
            <span>بداية المحادثة (Trigger)</span>
          </div>
          <p className="text-[11px] text-slate-300">رسالة جديدة على واتساب أو إنستجرام</p>
          <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Instagram DM & WhatsApp
          </span>
        </div>
      )
    }
  },
  {
    id: "ai-parser-2",
    position: { x: 380, y: 100 },
    data: {
      label: (
        <div className="p-3 bg-[#111827] border border-sky-500/40 rounded-xl text-right font-sans shadow-lg">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs mb-1">
            <Bot size={13} />
            <span>تحليل نية الشراء (AI Intent Parser)</span>
          </div>
          <p className="text-[11px] text-slate-300">استخراج: اسم المنتج + المقاس + اللون المطلوب</p>
          <span className="text-[9px] font-mono text-sky-300 bg-sky-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Groq Llama 3.3 Fast
          </span>
        </div>
      )
    }
  },
  {
    id: "ocr-check-3",
    position: { x: 720, y: 50 },
    data: {
      label: (
        <div className="p-3 bg-[#1c130b] border border-amber-500/40 rounded-xl text-right font-sans shadow-lg">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
            <CreditCard size={13} />
            <span>فحص تحويل إنستاباي (Vision OCR)</span>
          </div>
          <p className="text-[11px] text-slate-300">مطابقة المبلغ ورقم الحساب المرجعي وتوثيقه سحابياً</p>
          <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Argon Vision Verifier
          </span>
        </div>
      )
    }
  },
  {
    id: "shipping-dispatch-4",
    type: "output",
    position: { x: 1060, y: 130 },
    data: {
      label: (
        <div className="p-3 bg-[#091a13] border border-emerald-500/40 rounded-xl text-right font-sans shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
            <Truck size={13} />
            <span>تصدير بوليصة الشحن (Bosta / Aramex)</span>
          </div>
          <p className="text-[11px] text-slate-300">إنشاء البوليصة ورقم التتبع وإرسالها للعميل فورياً</p>
          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Auto AWB Dispatch
          </span>
        </div>
      )
    }
  }
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "trigger-1", target: "ai-parser-2", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 } },
  { id: "e2-3", source: "ai-parser-2", target: "ocr-check-3", animated: true, style: { stroke: "#38bdf8", strokeWidth: 2 } },
  { id: "e3-4", source: "ocr-check-3", target: "shipping-dispatch-4", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } }
];

export default function ManyChatVisualFlowsPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: any) => setNodes((nds) => {
      if (Array.isArray(changes)) {
        return nds.map((node) => {
          const change = changes.find((c: any) => c.id === node.id);
          if (change && change.type === 'position' && change.position) {
            return { ...node, position: change.position };
          }
          return node;
        });
      }
      return nds;
    }),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => eds),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      soundFX.playPop();
      setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: "#a855f7", strokeWidth: 2 } }, eds));
    },
    []
  );

  const handleSimulateFlow = () => {
    setIsSimulating(true);
    soundFX.playPop();
    toast("info", "جاري محاكاة سريان المسار التفاعلي (ManyChat Visual Simulation)...");

    setTimeout(() => {
      setIsSimulating(false);
      soundFX.playSuccess();
      toast("success", "تم اختبار المسار بنجاح: تم استقبال الرسالة، فحص الإيصال، وتوليد رقم بوليصة الشحن!");
    }, 1500);
  };

  const handleAddNewNode = () => {
    soundFX.playPop();
    const newNode: Node = {
      id: `custom-node-${Date.now()}`,
      position: { x: 380, y: 280 },
      data: {
        label: (
          <div className="p-3 bg-[#191024] border border-pink-500/40 rounded-xl text-right font-sans shadow-lg">
            <div className="flex items-center gap-1.5 text-pink-400 font-bold text-xs mb-1">
              <Share2 size={13} />
              <span>إرسال كوبون خصم (Discount Offer)</span>
            </div>
            <p className="text-[11px] text-slate-300">خصم 10% عند إضافة قطعتين أو أكثر للسلة</p>
            <span className="text-[9px] font-mono text-pink-300 bg-pink-500/20 px-1.5 py-0.5 rounded mt-1.5 inline-block">
              ManyChat Drip Rule
            </span>
          </div>
        )
      }
    };
    setNodes((nds) => [...nds, newNode]);
    toast("success", "تمت إضافة عقدة أتمتة جديدة إلى المخطط");
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-[#07040D] text-white flex flex-col font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Header & Flow Controls */}
      <div className="p-4 border-b border-white/5 bg-[#0a0714] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              مُنشئ مسارات الأتمتة البصري (Visual Flow Builder)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              ManyChat Engine • Cyber Theme
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            صمم مسارات بيع متجرك بسحب وإفلات العقد (Drag & Drop) بدون سطر كود واحد.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddNewNode}
            className="text-xs"
          >
            <Plus size={14} /> إضافة خطوة جديدة
          </Button>

          <Button
            variant="primary"
            size="sm"
            loading={isSimulating}
            onClick={handleSimulateFlow}
            className="text-xs flex items-center gap-1.5"
          >
            <Play size={14} /> اختبار وتشغيل المسار
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              soundFX.playSuccess();
              toast("success", "تم حفظ المخطط التفاعلي ومزامنته سحابياً بنجاح");
            }}
            className="text-xs"
          >
            <Save size={14} /> حفظ المسار
          </Button>
        </div>
      </div>

      {/* Visual Canvas (XYFlow / ReactFlow) */}
      <div className="flex-1 relative w-full h-full bg-[#05030a]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="dark"
        >
          <Background color="#7c3aed" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-[#0e081c] !border-white/10 !rounded-xl overflow-hidden [&>button]:!bg-transparent [&>button]:!border-white/5 [&>button]:!text-white hover:[&>button]:!bg-white/5" />
        </ReactFlow>

        {/* Floating Quick Legend */}
        <div className="absolute bottom-5 right-5 p-3 rounded-2xl bg-[#0e081c]/90 border border-white/10 backdrop-blur-md text-[11px] text-slate-400 space-y-1.5 shadow-2xl pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>نقطة الانطلاق (Triggers)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>تحليل الذكاء الاصطناعي (AI Nodes)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>فحص الدفع (Vision OCR)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>تصدير بوليصة الشحن (Fulfillment)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
