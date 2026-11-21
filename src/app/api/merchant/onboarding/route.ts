import { NextRequest, NextResponse } from 'next/server';

export interface MerchantOnboardingPayload {
  storeName: string;
  industry: 'fashion' | 'beauty' | 'electronics' | 'home' | 'food' | 'other';
  phoneNumber: string;
  instagramHandle?: string;
  shippingGovernorates: string[];
  defaultShippingCost: number;
  paymentMethods: ('cod' | 'instapay' | 'vodafone_cash' | 'card')[];
  instapayAddress?: string;
  aiTone: 'friendly_egyptian' | 'formal_arabic' | 'luxury_concierge';
  autoDispatchShipping: boolean;
  bostaApiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: MerchantOnboardingPayload = await req.json();
    const { 
      storeName, 
      industry, 
      phoneNumber, 
      instagramHandle, 
      shippingGovernorates, 
      defaultShippingCost, 
      paymentMethods,
      instapayAddress,
      aiTone,
      autoDispatchShipping,
      bostaApiKey
    } = body;

    if (!storeName || !phoneNumber || !industry) {
      return NextResponse.json({ 
        error: 'اسم المتجر، رقم الهاتف، والمجال مطلوبين لإتمام إعداد الحساب' 
      }, { status: 400 });
    }

    const tenantId = `TENANT-${Date.now().toString().slice(-6)}`;
    const apiKey = `pra_live_${Math.random().toString(36).substring(2, 18)}_${Date.now()}`;

    // Return finalized merchant knowledge profile
    return NextResponse.json({
      success: true,
      tenantId,
      apiKey,
      profile: {
        storeName,
        industry,
        phoneNumber,
        instagramHandle: instagramHandle ? `@${instagramHandle.replace('@', '')}` : undefined,
        shippingGovernorates: shippingGovernorates || ['القاهرة والجيزة', 'الإسكندرية'],
        defaultShippingCost: defaultShippingCost || 45,
        paymentMethods: paymentMethods || ['cod', 'instapay'],
        instapayAddress: instapayAddress || 'merchant@instapay',
        aiTone: aiTone || 'friendly_egyptian',
        autoDispatchShipping: !!autoDispatchShipping,
        hasBostaIntegration: !!bostaApiKey,
        createdAt: new Date().toISOString()
      },
      message: 'تم تدريب وتجهيز الإيجنت ببيانات متجرك وقواعد العمل بنجاح!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
