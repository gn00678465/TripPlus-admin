import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = request.cookies.has('token');
  if (request.nextUrl.pathname.endsWith('/admin/login')) {
    if (isLogin) {
      return NextResponse.redirect(new URL('/admin/projects', request.url));
    }
    return NextResponse.next();
  }
  if (!isLogin) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*'
};
