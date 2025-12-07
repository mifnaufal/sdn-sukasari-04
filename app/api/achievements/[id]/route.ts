import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
interface Params {
  params: {
    id: string;
  };
}
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const achievements = await queryDB<any[]>(
      'SELECT * FROM achievements WHERE id = ?',
      [id]
    );
    if (achievements.length === 0) {
      return NextResponse.json(
        { error: 'Prestasi tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ achievement: achievements[0] });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'guru')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = params;
    const body = await request.json();
    const { title, description, type, date, image_url } = body;
    await queryDB(
      `UPDATE achievements 
       SET title = ?, description = ?, type = ?, date = ?, image_url = ?
       WHERE id = ?`,
      [title, description, type, date, image_url || null, id]
    );
    return NextResponse.json({
      message: 'Prestasi berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = params;
    await queryDB('DELETE FROM achievements WHERE id = ?', [id]);
    return NextResponse.json({
      message: 'Prestasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}