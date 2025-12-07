import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
  try {
    const staff = await queryDB<any[]>(
      'SELECT * FROM staff ORDER BY position'
    );
    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { name, position, photo_url, description } = body;
    const result = await queryDB(
      `INSERT INTO staff (name, position, photo_url, description)
       VALUES (?, ?, ?, ?)`,
      [name, position, photo_url || null, description || null]
    );
    return NextResponse.json({
      message: 'Staf berhasil ditambahkan',
      id: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}