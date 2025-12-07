import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
  try {
    const achievements = await queryDB<any[]>(
      'SELECT * FROM achievements ORDER BY date DESC'
    );
    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { title, description, type, date, image_url } = body;
    const result = await queryDB(
      `INSERT INTO achievements (title, description, type, date, image_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, type || 'siswa', date, image_url || null, user.id]
    );
    return NextResponse.json({
      message: 'Prestasi berhasil ditambahkan',
      id: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}