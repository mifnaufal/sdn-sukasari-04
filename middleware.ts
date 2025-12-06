import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';
const protectedRoutes = ['/admin', '/guru', '/profile'];
const adminRoutes = ['/admin'];
const guruRoutes = ['/guru'];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  const user = verifyToken(token);
  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
  if (adminRoutes.some(route => pathname.startsWith(route)) && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (guruRoutes.some(route => pathname.startsWith(route)) && 
      (user.role !== 'admin' && user.role !== 'guru')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};