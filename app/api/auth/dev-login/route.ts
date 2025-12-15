import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const user = { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' };
  const response = NextResponse.json({
    message: 'Dev login successful',
    user
  });
  response.cookies.set('auth-token', 'dev-token-123', {
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}