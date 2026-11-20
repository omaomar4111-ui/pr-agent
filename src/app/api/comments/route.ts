import { NextRequest, NextResponse } from 'next/server';

export interface CommentEvent {
  postId: string;
  commentId: string;
  userName: string;
  commentText: string;
  platform: 'facebook' | 'instagram';
}

export async function POST(req: NextRequest) {
  try {
    const body: CommentEvent = await req.json();
    const { postId, commentId, userName, commentText, platform = 'instagram' } = body;

    // AI logic to analyze comment intent
    const textLower = (commentText || '').toLowerCase();
    let isPricingInquiry = textLower.includes('سعر') || textLower.includes('كام') || textLower.includes('بكم') || textLower.includes('price');
    let isDetailsInquiry = textLower.includes('مقاس') || textLower.includes('خامة') || textLower.includes('متاح') || textLower.includes('تفاصيل');

    // 1. Generate immediate public reply
    let publicReply = `أهلاً بيك يا ${userName}! 🌸 بعتنالك كل التفاصيل وصور المقاسات في رسالة خاصة (DM) فوراً، شيك على الرسايل ✨`;
    if (!isPricingInquiry && !isDetailsInquiry) {
      publicReply = `منورنا يا ${userName}! تم الرد عليك في الخاص بكل التفاصيل 📩`;
    }

    // 2. Generate private direct message (DM) to convert to sale
    const privateDmMessage = `أهلاً يا ${userName}! بخصوص استفسارك عن المنتج:\nالسعر الحالي 650 ج.م مع شحن مجاني اليوم لأول أوردر.\nتحب نجهزلك مقاس L أو XL؟ تقدر تكتبلنا هنا فوراً وهنسجلهولك في ثواني!`;

    return NextResponse.json({
      success: true,
      platform,
      postId,
      commentId,
      user: userName,
      detectedIntent: isPricingInquiry ? 'pricing_inquiry' : isDetailsInquiry ? 'spec_inquiry' : 'general',
      autoActions: {
        publicCommentReplied: true,
        publicReplyText: publicReply,
        privateDmSent: true,
        privateDmText: privateDmMessage,
        conversationCreated: true,
        inboxChannel: platform
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
