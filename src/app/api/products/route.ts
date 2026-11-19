import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  description: string;
}

// In-memory fallback if Supabase table is not yet migrated
let memoryCatalog: ProductItem[] = [
  {
    id: "prod-1",
    name: "تيشيرت أوفر سايز قطن ميلتون أسود",
    price: 450,
    category: "ملابس رجالي",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "رمادي فحمى", "أبيض"],
    description: "قطن مصري 100% معالج ضد الانكماش مع طباعة سكرين مقاومة للغسيل."
  },
  {
    id: "prod-2",
    name: "هودي شتوي ثقيل مبطن كحلي",
    price: 780,
    category: "ملابس شتوي",
    inStock: true,
    sizes: ["L", "XL"],
    colors: ["كحلي", "زيتي"],
    description: "مبطن بطبقة فرو ناعمة وغطاء رأس مزدوج لحماية كاملة من البرد."
  },
  {
    id: "prod-3",
    name: "حذاء سنيكرز جلد كاجوال أبيض",
    price: 1100,
    category: "أحذية",
    inStock: true,
    sizes: ["41", "42", "43", "44", "45"],
    colors: ["أبيض", "أسود"],
    description: "نعل طبي مريح للارتداء طوال اليوم مع طبقة خارجية سهلة التنظيف."
  }
];

export async function GET(request: Request) {
  try {
    if (supabaseAdmin) {
      const { data: dbProducts, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbProducts && dbProducts.length > 0) {
        return NextResponse.json({
          success: true,
          products: dbProducts
        });
      }
    }

    return NextResponse.json({
      success: true,
      products: memoryCatalog
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, category, sizes = [], colors = [], description = '' } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name,
      price: Number(price),
      category: category || 'عام',
      inStock: true,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      colors: Array.isArray(colors) ? colors : [colors],
      description
    };

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([{
          id: newProduct.id,
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          sizes: newProduct.sizes,
          colors: newProduct.colors,
          description: newProduct.description,
          in_stock: true
        }])
        .select()
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ success: true, product: data });
      }
    }

    // Fallback store
    memoryCatalog.unshift(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
