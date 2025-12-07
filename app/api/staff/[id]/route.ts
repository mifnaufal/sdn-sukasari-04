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
    const staff = await queryDB<any[]>(
      'SELECT * FROM staff WHERE id = ?',
      [id]
    );
    if (staff.length === 0) {
      return NextResponse.json(
        { error: 'Staf tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json({ staff: staff[0] });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = params;
    const body = await request.json();
    const { name, position, photo_url, description } = body;
    await queryDB(
      `UPDATE staff 
       SET name = ?, position = ?, photo_url = ?, description = ?
       WHERE id = ?`,
      [name, position, photo_url || null, description || null, id]
    );
    return NextResponse.json({
      message: 'Staf berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating staff:', error);
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
    await queryDB('DELETE FROM staff WHERE id = ?', [id]);
    return NextResponse.json({
      message: 'Staf berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}