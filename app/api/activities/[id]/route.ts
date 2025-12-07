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
    const activities = await queryDB<any[]>(
      'SELECT * FROM activities WHERE id = ?',
      [id]
    );
    if (activities.length === 0) {
      return NextResponse.json(
        { error: 'Kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ activity: activities[0] });
  } catch (error) {
    console.error('Error fetching activity:', error);
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
    const { title, description, date, image_url } = body;
    await queryDB(
      `UPDATE activities 
       SET title = ?, description = ?, date = ?, image_url = ?
       WHERE id = ?`,
      [title, description, date, image_url || null, id]
    );
    return NextResponse.json({
      message: 'Kegiatan berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
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
    await queryDB('DELETE FROM activities WHERE id = ?', [id]);
    return NextResponse.json({
      message: 'Kegiatan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}