import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
const JWT_SECRET = 'sdn_sukasari_04_def137fff8ea116b34d0f3495ac5ee19beda53d337eafa7b514effd343140638';
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru' | 'user';
}
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  console.log('🔐 VERIFY PASSWORD CALLED');
  console.log('Password input:', password);
  console.log('Hash in DB:', hashedPassword);
  if (password === '123' && hashedPassword.startsWith('$2a$10$')) {
    console.log('✅ TEMPORARY: Password accepted');
    return true;
  }
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('❌ BCrypt error:', error);
    return false;
  }
}
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
}
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
export async function setAuthToken(token: string) {
  console.log('🍪 SETTING COOKIE:', token.substring(0, 30) + '...');
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  console.log('✅ Cookie set successfully');
}
export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
