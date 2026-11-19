'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  DollarSign, 
  Tag, 
  ArrowRight,
  Database
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  description: string;
}

export default function CatalogTrainingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ملابس رجالي');
  const [sizes, setSizes] = useState('S, M, L, XL');
  const [colors, setColors] = useState('أسود, أبيض');
  const [description, setDescription] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
          colors: colors.split(',').map(c => c.trim()).filter(Boolean),
          description
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setName('');
        setPrice('');
        setDescription('');
        loadProducts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040D] text-white p-6 md:p-10 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">كتالوج وتدريب الذكاء الاصطناعي</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
              AI Knowledge Base
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            أدخل منتجاتك ومقاساتها وأسعارها؛ سيتعلمها الذكاء الاصطناعي فورياً للرد على العملاء وإغلاق المبيعات.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition"
          >
            <ArrowRight size={14} /> لوحة التحكم
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold shadow-lg shadow-purple-600/20 transition"
          >
            <Plus size={14} /> إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="my-8 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">المزامنة الحية مع وكلاء الردود (Live LLM Sync)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              كل منتج تدخله هنا يُضاف في ثانية واحدة إلى ذاكرة وكيل المبيعات (Sales Agent) للرد على استفسارات المقاس واللون والسعر.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 size={14} /> متصل بقاعدة المعرفة السحابية
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            جاري مزامنة كتالوج المنتجات...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-white/10">
            <Package size={36} className="text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">الكتالوج فارغ حالياً</h3>
            <p className="text-xs text-slate-500 mt-1">ابدأ بإضافة أول منتج لتدريب البوت على أسعارك وخاماتك.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold"
            >
              + إضافة منتج
            </button>
          </div>
        ) : (
          products.map((prod) => (
            <div key={prod.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-purple-400 font-medium">
                    {prod.category}
                  </span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    {prod.price} ج.م
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-3">{prod.name}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {prod.description || 'لا يوجد وصف تفصيلي.'}
                </p>

                <div className="mt-4 space-y-2 pt-3 border-t border-white/5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">المقاسات:</span>
                    <div className="flex flex-wrap gap-1">
                      {prod.sizes?.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">الألوان:</span>
                    <div className="flex flex-wrap gap-1">
                      {prod.colors?.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <CheckCircle2 size={12} /> متوفر في المخزن
                </span>
                <span className="font-mono text-[10px] text-slate-600">{prod.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#110B22] border border-white/10 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold">إضافة منتج وتدريب البوت</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ إغلاق
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تيشيرت صيفي قطن أسود"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">السعر (ج.م)</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">المقاسات (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={e => setSizes(e.target.value)}
                  placeholder="S, M, L, XL"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">الألوان المتاحة (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={e => setColors(e.target.value)}
                  placeholder="أسود, كحلي, بيج"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">الوصف وخامة المنتج (لتدريب الذكاء الاصطناعي)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="خامة قطن مصري 100% معالج ضد الانكماش مع إمكانية المعاينة قبل الاستلام."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  {saving ? 'جاري التدريب والحفظ...' : 'حفظ وتدريب الـ AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
