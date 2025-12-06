import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password diperlukan' },
        { status: 400 }
      );
    }
    const existingUser = await queryDB(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }
    const hashedPassword = await hashPassword(password);
    const result = await queryDB(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user']
    ) as any;
    return NextResponse.json(
      { 
        message: 'Registrasi berhasil', 
        userId: result.insertId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}