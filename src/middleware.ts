import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/', request.url));
  if (request.nextUrl.pathname.endsWith('login')) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*'
};
