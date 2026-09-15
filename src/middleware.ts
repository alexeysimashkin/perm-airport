import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const isTargetingAdmin = request.nextUrl.pathname.startsWith('/admin');

  // Если пытаются зайти в /admin без подтвержденной сессии — отправляем на /login
  if (isTargetingAdmin && session !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
