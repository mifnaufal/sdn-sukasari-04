import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'sdn_sukasari_04_def137fff8ea116b34d0f3495ac5ee19beda53d337eafa7b514effd343140638';
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('🔓 MIDDLEWARE: Path =', pathname);
  console.log('🍪 Cookies:', request.cookies.getAll());
  if (pathname.startsWith('/admin') || pathname.startsWith('/guru')) {
    console.log('⚠️ BYPASSING AUTH FOR DEVELOPMENT');
    return NextResponse.next();
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
