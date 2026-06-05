import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_VERIFIED, getStoredAdminPassword } from '@/lib/admin-auth';

const getSafeRedirect = (request: NextRequest) => {
  const redirect = request.nextUrl.searchParams.get('redirect') || '/admindashboard';
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/admindashboard';
};

export async function POST(request: NextRequest) {
  const redirect = getSafeRedirect(request);
  const formData = await request.formData();
  const submitted = String(formData.get('password') ?? '').trim();
  const stored = await getStoredAdminPassword();

  if (stored && submitted === stored) {
    const response = NextResponse.redirect(new URL(redirect, request.url));
    response.cookies.set(ADMIN_COOKIE_VERIFIED, 'true', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return response;
  }

  const url = new URL(redirect, request.url);
  url.searchParams.set('admin_error', '1');
  return NextResponse.redirect(url);
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/admindashboard', request.url));
}
