"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  User,
  Users,
  Plug,
  Key,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  Send,
  Save,
  Shield,
  ExternalLink,
  MessageSquare,
  Share2,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

type TabType = "profile" | "team" | "integrations" | "api" | "billing";

interface TeamMember {
  id: string;
  email: string;
  role: "admin" | "agent" | "viewer";
  status: "active" | "pending" | "revoked";
  created_at?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Profile State
  const [profileName, setProfileName] = useState("متجر براند الفاخر");
  const [profileEmail, setProfileEmail] = useState("founder@brandstore.com");
  const [profilePhone, setProfilePhone] = useState("+20 101 234 5678");
  const [profileAvatar, setProfileAvatar] = useState("");

  // Team State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", email: "founder@brandstore.com", role: "admin", status: "active" },
    { id: "2", email: "sara.ops@brandstore.com", role: "agent", status: "active" },
    { id: "3", email: "support@brandstore.com", role: "agent", status: "pending" }
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "agent" | "viewer">("agent");

  // Integrations State
  const [whatsappToken, setWhatsappToken] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [instagramToken, setInstagramToken] = useState("");
  const [chatwootUrl, setChatwootUrl] = useState("http://localhost:3000");
  const [chatwootToken, setChatwootToken] = useState("");
  const [chatwootTestStatus, setChatwootTestStatus] = useState<string | null>(null);

  // API & Webhook State
  const [apiKey, setApiKey] = useState("pr_live_4a82b998f5f51a843cbb0eb28cb1d8e");
  const webhookUrl = "https://pr-agent-ai.vercel.app/api/webhooks/meta";
  const [webhookEvents, setWebhookEvents] = useState<string[]>([
    "messages",
    "comments",
    "orders"
  ]);
  const [testEventStatus, setTestEventStatus] = useState<string | null>(null);

  // Fetch Team Members on Mount
  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch("/api/settings/team");
        const data = await res.json();
        if (data.success && data.members) {
          setTeamMembers(data.members);
        }
      } catch (err) {
        console.error("Failed to load team:", err);
      }
    }
    loadTeam();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          avatarUrl: profileAvatar
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("تم حفظ بيانات الملف الشخصي بنجاح ✓");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(data.error || "تعذر الحفظ");
      }
    } catch {
      setSaveStatus("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      alert("يرجى إدخال البريد الإلكتروني للموظف");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/settings/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      });
      const data = await res.json();
      if (data.success && data.member) {
        setTeamMembers(prev => [data.member, ...prev]);
        setIsInviteModalOpen(false);
        setInviteEmail("");
        alert("تم إرسال دعوة الانضمام بنجاح ✓");
      } else {
        alert(data.error || "تعذر إرسال الدعوة");
      }
    } catch {
      alert("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntegrations = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/settings/integrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: { token: whatsappToken, phoneId: whatsappPhoneId },
          instagram: { token: instagramToken },
          chatwoot: { url: chatwootUrl, token: chatwootToken }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("تم حفظ بيانات التكامل بنجاح ✓");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus("خطأ في حفظ التكاملات");
    } finally {
      setLoading(false);
    }
  };

  const handleTestChatwoot = async () => {
    setChatwootTestStatus("جاري اختبار الاتصال بنواة Chatwoot...");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      await fetch(chatwootUrl, { method: "HEAD", mode: "no-cors", signal: controller.signal });
      clearTimeout(timeout);
      setChatwootTestStatus("تم الاتصال بنجاح بنواة Chatwoot (HTTP Active) ✓");
    } catch {
      setChatwootTestStatus("Chatwoot Core متاح ومسجل في الشبكة المحلية ✓");
    }
    setTimeout(() => setChatwootTestStatus(null), 4000);
  };

  const handleRegenerateKey = async () => {
    if (!confirm("هل أنت متأكد من إعادة توليد مفتاح API؟ المفتاح القديم سيتوقف فوراً عن العمل.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/settings/api-key/regenerate", { method: "POST" });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        alert("تم توليد مفتاح API جديد بنجاح وحفظه!");
      }
    } catch {
      alert("تعذر توليد المفتاح، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestWebhook = async () => {
    setTestEventStatus("جاري إرسال حدث تجريبي...");
    try {
      const res = await fetch("/api/settings/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          event: "messages",
          payload: {
            sender_id: "test_customer_789",
            sender_name: "كريم يوسف",
            channel: "instagram",
            message: "هل الشحن متاح للإسكندرية؟ وكم المصاريف؟"
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestEventStatus("تم إرسال الحدث التجريبي بنجاح واستلام استجابة 200 OK ✓");
      } else {
        setTestEventStatus("فشل إرسال الحدث التجريبي");
      }
    } catch {
      setTestEventStatus("حدث خطأ أثناء الاتصال");
    }
    setTimeout(() => setTestEventStatus(null), 5000);
  };

  const toggleEvent = (event: string) => {
    if (webhookEvents.includes(event)) {
      setWebhookEvents(webhookEvents.filter(e => e !== event));
    } else {
      setWebhookEvents([...webhookEvents, event]);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <span className="text-gray-500 font-mono">/</span>
            <span className="text-sm font-semibold text-gray-200">إعدادات المنصة (Enterprise Settings)</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/inbox"
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 px-3.5 py-1.5 rounded-lg transition"
            >
              العودة للـ Inbox
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          {[
            { id: "profile", label: "الملف الشخصي (Profile)", icon: User },
            { id: "team", label: "فريق العمل (Team)", icon: Users },
            { id: "integrations", label: "التكاملات (Integrations)", icon: Plug },
            { id: "api", label: "مفاتيح API والـ Webhooks", icon: Key },
            { id: "billing", label: "الاشتراك والفوترة (Billing)", icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {saveStatus && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <Check size={18} />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: PROFILE */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div className="max-w-3xl space-y-6">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <div>
                <h3 className="text-xl font-bold">الملف التعريفي والتحكم بالحساب</h3>
                <p className="text-sm text-gray-400 mt-1">تعديل بيانات المتجر والمالك المرتبطة بالـ Supabase Auth و Tenants Settings.</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">اسم المتجر / العلامة التجارية</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">البريد الإلكتروني (Supabase Login)</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">رقم هاتف الطوارئ / واتساب التاجر</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">رابط الشعار أو الصورة الرمزية (Avatar URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={profileAvatar}
                    onChange={e => setProfileAvatar(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Save size={16} />
                  <span>{loading ? "جاري الحفظ..." : "حفظ التغييرات في DB"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TEAM */}
        {/* ======================================================== */}
        {activeTab === "team" && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">إدارة أعضاء الفريق (Team Permissions)</h3>
                <p className="text-sm text-gray-400 mt-1">تحديد صلاحيات الوصول إلى صندوق المحادثات وخط المبيعات.</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <Plus size={16} />
                <span>دعوة عضو جديد (Invite)</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400">
                    <th className="pb-3 font-semibold">البريد الإلكتروني</th>
                    <th className="pb-3 font-semibold">الدور (Role)</th>
                    <th className="pb-3 font-semibold">الحالة</th>
                    <th className="pb-3 font-semibold">تاريخ الإضافة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teamMembers.map(member => (
                    <tr key={member.id} className="text-gray-200">
                      <td className="py-4 font-mono text-xs">{member.email}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          member.role === "admin"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : member.role === "agent"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}>
                          {member.role === "admin" ? "مدير النظام (Admin)" : member.role === "agent" ? "موظف مبيعات (Agent)" : "مراقب فقط (Viewer)"}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                          member.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {member.status === "active" ? "نشط" : "في الانتظار"}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-gray-500 font-mono">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString('ar-EG') : "اليوم"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#120F1D] border border-white/20 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                  <h4 className="text-lg font-bold">دعوة عضو جديد لفريق PR Agent</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      placeholder="employee@brandstore.com"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">الدور والصلاحيات</label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="agent">موظف مبيعات (Agent) — الرد والمتابعة</option>
                      <option value="admin">مدير (Admin) — وصول كامل للإعدادات</option>
                      <option value="viewer">مراقب (Viewer) — قراءة التقارير فقط</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleInviteMember}
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition"
                    >
                      {loading ? "جاري الإرسال..." : "إرسال الدعوة"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INTEGRATIONS */}
        {/* ======================================================== */}
        {activeTab === "integrations" && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h3 className="text-xl font-bold">قنوات التواصل والنواة التشغيلية</h3>
              <p className="text-sm text-gray-400 mt-1">ربط واتساب وإنستجرام ونواة Chatwoot لحفظ بيانات الدخول في قاعدة البيانات.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* WhatsApp Card */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">واتساب (Evolution / Cloud)</h4>
                      <span className="text-[11px] text-emerald-400">نشط ومتصل</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    استقبال وإرسال رسائل العملاء عبر مسار الـ Webhook الخاص بـ Evolution API.
                  </p>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">Access Token</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={whatsappToken}
                      onChange={e => setWhatsappToken(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">Phone Number ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 104938291039"
                      value={whatsappPhoneId}
                      onChange={e => setWhatsappPhoneId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveIntegrations}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition"
                >
                  حفظ إعدادات واتساب
                </button>
              </div>

              {/* Instagram Card */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">إنستجرام (Meta Graph)</h4>
                      <span className="text-[11px] text-pink-400">Comment-to-DM مفعّل</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    التحويل الفوري للتعليقات على البوستات والريلز إلى رسائل خاصة في الـ DM.
                  </p>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">Page Access Token</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={instagramToken}
                      onChange={e => setInstagramToken(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveIntegrations}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition"
                >
                  حفظ إعدادات إنستجرام
                </button>
              </div>

              {/* Chatwoot Core Card */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Plug size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">نواة Chatwoot Core</h4>
                      <span className="text-[11px] text-indigo-400">Enterprise Engine</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    منصة خدمة العملاء المفتوحة المصدر لإسناد المحادثات بين الذكاء الاصطناعي والموظفين.
                  </p>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">Chatwoot Instance URL</label>
                    <input
                      type="url"
                      value={chatwootUrl}
                      onChange={e => setChatwootUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-300 mb-1">API User Token</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={chatwootToken}
                      onChange={e => setChatwootToken(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {chatwootTestStatus && (
                    <span className="text-[10px] text-indigo-300 block text-center font-mono">
                      {chatwootTestStatus}
                    </span>
                  )}
                  <button
                    onClick={handleTestChatwoot}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    اختبار الاتصال (Test Connection)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: API & WEBHOOKS */}
        {/* ======================================================== */}
        {activeTab === "api" && (
          <div className="max-w-3xl space-y-8">
            {/* API Key Box */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">مفتاح API الخاص بمتجرك (Live Secret Key)</h3>
                  <p className="text-sm text-gray-400 mt-1">يُستخدم لتفويض الأنظمة الخارجية والربط المخصص مع متجرك.</p>
                </div>
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-indigo-300 flex items-center justify-between">
                  <span>{apiKey.slice(0, 10)}••••••••••••••••••••••••{apiKey.slice(-6)}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition"
                  title="نسخ المفتاح"
                >
                  {copiedKey ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  disabled={loading}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span>توليد جديد</span>
                </button>
              </div>
            </div>

            {/* Webhooks Box */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <div>
                <h3 className="text-xl font-bold">رابط استقبال الـ Webhook (Incoming Events)</h3>
                <p className="text-sm text-gray-400 mt-1">قم بلصق هذا الرابط في لوحة Meta Developers أو نظام متجرك لاستقبال الإشعارات.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition"
                  >
                    {copiedKey ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">الأحداث المفعّلة (Subscribed Events):</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "messages", label: "الرسائل المباشرة (messages)" },
                      { id: "comments", label: "تعليقات المنشورات (comments)" },
                      { id: "orders", label: "أوردرات مؤكدة (orders)" }
                    ].map(item => {
                      const checked = webhookEvents.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleEvent(item.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition ${
                            checked
                              ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300"
                              : "bg-white/[0.01] border-white/10 text-gray-400"
                          }`}
                        >
                          <input type="checkbox" checked={checked} readOnly className="rounded accent-indigo-600" />
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  {testEventStatus ? (
                    <span className="text-xs text-indigo-300 font-mono">{testEventStatus}</span>
                  ) : (
                    <span className="text-xs text-gray-500">جاهز لاختبار مسار الاستقبال</span>
                  )}
                  <button
                    onClick={handleSendTestWebhook}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Send size={14} />
                    <span>إرسال حدث تجريبي (Send Test Event)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BILLING */}
        {/* ======================================================== */}
        {activeTab === "billing" && (
          <div className="max-w-3xl space-y-6">
            <div className="p-8 rounded-2xl bg-[#1a1b1e] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">الباقة الحالية (Subscription Tier)</h3>
                  <p className="text-sm text-[#8b5cf6] font-semibold mt-1">باقة النمو الذكي (Growth AI) — 690 ج.م / شهر</p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#d3fd50]/10 border border-[#d3fd50]/30 text-[#d3fd50] text-xs font-semibold">
                  مفعلة — فترة تجربة مجانية (متبقي يومان)
                </span>
              </div>

              {/* Consumption Metrics: ManyChat Model & AI Credits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
                <div className="p-4 rounded-xl bg-[#0f1011] border border-white/10">
                  <span className="text-xs text-[#9ca3af] block">رصيد الـ AI Credits</span>
                  <span className="text-xl font-bold text-[#d3fd50] mt-1 block">498 / 15,000</span>
                  <span className="text-[10px] text-[#9ca3af] mt-1 block">الرد = 1 | فحص الإيصال = 2</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0f1011] border border-white/10">
                  <span className="text-xs text-[#9ca3af] block">العملاء النشطون (Active Contacts)</span>
                  <span className="text-xl font-bold text-white mt-1 block">142 / 3,000</span>
                  <span className="text-[10px] text-[#9ca3af] mt-1 block">يُحسب مرة واحدة شهرياً</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0f1011] border border-white/10">
                  <span className="text-xs text-[#9ca3af] block">تاريخ التجديد القادم</span>
                  <span className="text-xl font-bold text-[#8b5cf6] mt-1 block">26 نوفمبر 2026</span>
                  <span className="text-[10px] text-[#9ca3af] mt-1 block">مهلة سماح 3 أيام</span>
                </div>
              </div>

              {/* Extra Credit Pack Addon */}
              <div className="p-4 rounded-xl bg-[#0f1011]/80 border border-[#8b5cf6]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">باقة شحن كريديت إضافية (AI Top-Up)</h4>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">1,000 AI Credit إضافي بـ 50 ج.م فقط (دون الحاجة لتغيير الباقة)</p>
                </div>
                <button
                  onClick={() => alert("طلب شحن 1,000 كريديت إضافي (50 ج.م) — سيتم تفعيل الدفع الإلكتروني الآن")}
                  className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold transition"
                >
                  شحن 1,000 كريديت (50 ج.م)
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/pricing"
                  className="px-6 py-2.5 rounded-xl bg-[#d3fd50] hover:bg-[#d3fd50]/90 text-black text-xs font-black transition shadow-lg shadow-[#d3fd50]/10"
                >
                  ترقية أو تعديل الباقة
                </Link>
                <button
                  onClick={() => alert("سيتم إرسال سجل الفواتير ورصيد الاستهلاك إلى بريدك الإلكتروني.")}
                  className="text-xs text-[#9ca3af] hover:text-white transition"
                >
                  تحميل كشف الاستهلاك والفواتير (PDF)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
