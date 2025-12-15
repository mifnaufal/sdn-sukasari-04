// FIX-AUTH-COMPLETE.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔥🔥🔥 FIXING AUTH SYSTEM 🔥🔥🔥\n');

// 1. GENERATE NEW RANDOM SECRET
const newSecret = 'sdn_sukasari_04_' + crypto.randomBytes(32).toString('hex');
console.log('🔐 NEW JWT SECRET:', newSecret);

// 2. UPDATE .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = `# AUTH FIXED ${new Date().toISOString()}
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sdn_sukasari_04_final
DB_PORT=3306

# JWT SECRET (MUST BE SAME EVERYWHERE!)
JWT_SECRET=${newSecret}

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ .env.local UPDATED');

// 3. UPDATE lib/auth.ts
const authPath = path.join(__dirname, 'lib/auth.ts');
const authContent = `// lib/auth.ts - FIXED ${new Date().toISOString()}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// 🔥🔥🔥 IMPORTANT: MUST MATCH .env.local 🔥🔥🔥
const JWT_SECRET = '${newSecret}';

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
  return bcrypt.compare(password, hashedPassword);
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
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
`;

fs.writeFileSync(authPath, authContent);
console.log('✅ lib/auth.ts UPDATED');

// 4. UPDATE middleware.ts untuk debug lebih detail
const middlewarePath = path.join(__dirname, 'middleware.ts');
const middlewareContent = `// middleware.ts - DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '${newSecret}';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('\\n🔐 ======= MIDDLEWARE DEBUG =======');
  console.log('📍 Path:', pathname);
  
  // Skip for static files and auth API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth-token')?.value;
  console.log('🍪 Token exists?', !!token);
  
  if (token) {
    try {
      console.log('🔍 Token preview:', token.substring(0, 30) + '...');
      
      // DEBUG: Decode without verification first
      const decoded = jwt.decode(token);
      console.log('📄 Decoded token:', decoded);
      
      // Now verify
      const verified = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token VERIFIED:', verified);
      
      const user = verified as any;
      
      // Check protected routes
      if (pathname.startsWith('/admin') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      if (pathname.startsWith('/guru') && !['admin', 'guru'].includes(user.role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
      
    } catch (error: any) {
      console.log('❌ Token verification ERROR:', error.message);
      console.log('🔑 JWT_SECRET used:', JWT_SECRET.substring(0, 10) + '...');
      
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }
  
  // No token
  if (pathname.startsWith('/admin') || pathname.startsWith('/guru')) {
    console.log('⛔ No token for protected route');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;

fs.writeFileSync(middlewarePath, middlewareContent);
console.log('✅ middleware.ts UPDATED');

// 5. CREATE TEST SCRIPT
const testPath = path.join(__dirname, 'test-jwt.js');
const testContent = `// test-jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = '${newSecret}';

// Create test token
const testUser = {
  id: 1,
  name: 'Test Admin',
  email: 'test@example.com',
  role: 'admin'
};

console.log('🔐 Testing JWT with secret:', JWT_SECRET.substring(0, 20) + '...');

// Generate token
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '7d' });
console.log('✅ Token generated:', token.substring(0, 50) + '...');

// Verify token
try {
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully!');
  console.log('📋 Payload:', verified);
} catch (error) {
  console.log('❌ Verification failed:', error.message);
}
`;

fs.writeFileSync(testPath, testContent);
console.log('✅ test-jwt.js CREATED');

// 6. SQL untuk reset user
console.log('\\n📦 SQL untuk reset user di MySQL:');
console.log(`
USE sdn_sukasari_04_final;

DELETE FROM users WHERE email = 'admin@sukasari04.sch.id';

-- Password: admin123
INSERT INTO users (name, email, password, role) 
VALUES (
  'Admin SDN Sukasari 04',
  'admin@sukasari04.sch.id',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeYR0Tp0JmQ9G7cL5B6H7dQ5sYVYZ8QaC',
  'admin'
);

SELECT * FROM users;
`);

console.log('\\n🎯 LANGKAH SELANJUTNYA:');
console.log('1. Jalankan SQL di atas di MySQL');
console.log('2. Stop server (Ctrl+C)');
console.log('3. rm -rf .next node_modules/.cache');
console.log('4. npm run dev');
console.log('5. Login dengan admin@sukasari04.sch.id / admin123');