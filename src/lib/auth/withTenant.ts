import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, TenantContext, requireRole } from './getTenantContext';

type Handler = (req: NextRequest, ctx: TenantContext) => Promise<NextResponse>;

export function withTenant(handler: Handler, requiredRoles?: TenantContext['role'][]) {
  return async (req: NextRequest) => {
    try {
      const ctx = await getTenantContext();
      if (requiredRoles) requireRole(ctx, ...requiredRoles);
      return await handler(req, ctx);
    } catch (err: any) {
      if (err.message === 'UNAUTHENTICATED') {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
      if (err.message === 'NO_TENANT') {
        return NextResponse.json({ error: 'no_tenant', redirect: '/onboarding' }, { status: 403 });
      }
      if (err.message?.startsWith('FORBIDDEN')) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
      console.error('withTenant error:', err);
      return NextResponse.json({ error: 'internal' }, { status: 500 });
    }
  };
}
