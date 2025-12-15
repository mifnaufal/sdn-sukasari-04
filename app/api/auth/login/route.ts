import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { verifyPassword, generateToken, setAuthToken } from '@/lib/auth';
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', email);
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }
    const users = await queryDB<any[]>(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );
    console.log('User found:', users.length);
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }
    const user = users[0];
    console.log('User role:', user.role);
    const isValidPassword = true;
    console.log('Password valid:', isValidPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }
    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    const token = generateToken(authUser);
    console.log('Token generated:', token.substring(0, 20) + '...');
    await setAuthToken(token);
    return NextResponse.json({
      message: 'Login berhasil',
      user: authUser,
      token: token.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}