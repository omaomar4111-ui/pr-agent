import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default-tenant';

    if (isSupabaseConfigured()) {
      const { data: members, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (!error && members && members.length > 0) {
        return NextResponse.json({ success: true, members });
      }
    }

    // Default mock response when DB not populated yet
    const fallbackMembers = [
      { id: '1', email: 'owner@brandstore.com', role: 'owner', status: 'active', created_at: new Date().toISOString() },
      { id: '2', email: 'support@brandstore.com', role: 'agent', status: 'active', created_at: new Date().toISOString() },
      { id: '3', email: 'audit@brandstore.com', role: 'viewer', status: 'pending', created_at: new Date().toISOString() },
    ];

    return NextResponse.json({ success: true, members: fallbackMembers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, tenantId } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    const targetTenantId = tenantId || 'default-tenant';
    const targetRole = role || 'agent';

    let newMember = {
      id: `tm-${Date.now()}`,
      tenant_id: targetTenantId,
      email,
      role: targetRole,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('team_members')
        .insert({
          tenant_id: targetTenantId,
          email,
          role: targetRole,
          status: 'pending'
        })
        .select()
        .single();

      if (!error && data) {
        newMember = data;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الدعوة بنجاح',
      member: newMember
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * P0 Security Fix: Last Owner Protection on Member Role Changes
 * Prevents downgrading the only active Owner of a tenant.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, newRole, tenantId } = body;

    if (!memberId || !newRole) {
      return NextResponse.json({ success: false, error: 'memberId and newRole are required' }, { status: 400 });
    }

    const targetTenantId = tenantId || 'default-tenant';

    if (isSupabaseConfigured() && supabaseAdmin) {
      // 1. Fetch target member
      const { data: member, error: memberErr } = await supabaseAdmin
        .from('team_members')
        .select('id, role, status, tenant_id')
        .eq('id', memberId)
        .eq('tenant_id', targetTenantId)
        .single();

      if (memberErr || !member) {
        return NextResponse.json({ success: false, error: 'العضو غير موجود' }, { status: 404 });
      }

      // 2. If currently an owner and changing to a non-owner role, verify active owner count
      if (member.role === 'owner' && newRole !== 'owner') {
        const { count, error: countErr } = await supabaseAdmin
          .from('team_members')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', targetTenantId)
          .eq('role', 'owner')
          .eq('status', 'active');

        if (countErr) {
          return NextResponse.json({ success: false, error: 'فشل التحقق من أصحاب الحساب' }, { status: 500 });
        }

        if ((count || 0) <= 1) {
          return NextResponse.json({
            success: false,
            error: 'LAST_OWNER_PROTECTION: لا يمكن تعديل رتبة المالك الأخير للحساب. يجب تعيين مالك آخر أولاً.'
          }, { status: 409 });
        }
      }

      // 3. Update role
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, member: updated });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث رتبة العضو بنجاح (Local Mode)',
      member: { id: memberId, role: newRole }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * P0 Security Fix: Last Owner Protection on Member Removal
 * Prevents deleting or revoking the only active Owner of a tenant.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const tenantId = searchParams.get('tenantId') || 'default-tenant';

    if (!memberId) {
      return NextResponse.json({ success: false, error: 'memberId is required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabaseAdmin) {
      // 1. Fetch target member
      const { data: member, error: memberErr } = await supabaseAdmin
        .from('team_members')
        .select('id, role, status, tenant_id')
        .eq('id', memberId)
        .eq('tenant_id', tenantId)
        .single();

      if (memberErr || !member) {
        return NextResponse.json({ success: false, error: 'العضو غير موجود' }, { status: 404 });
      }

      // 2. Check if member is an owner
      if (member.role === 'owner') {
        const { count, error: countErr } = await supabaseAdmin
          .from('team_members')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .eq('role', 'owner')
          .eq('status', 'active');

        if (countErr) {
          return NextResponse.json({ success: false, error: 'فشل فحص الملاك' }, { status: 500 });
        }

        if ((count || 0) <= 1) {
          return NextResponse.json({
            success: false,
            error: 'LAST_OWNER_PROTECTION: لا يمكن حذف أو إلغاء حساب المالك الأخير للشركة.'
          }, { status: 409 });
        }
      }

      // 3. Delete or revoke member
      const { error: deleteErr } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (deleteErr) {
        return NextResponse.json({ success: false, error: deleteErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'تم إزالة العضو بنجاح' });
    }

    return NextResponse.json({ success: true, message: 'تم إزالة العضو بنجاح (Local Mode)' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
