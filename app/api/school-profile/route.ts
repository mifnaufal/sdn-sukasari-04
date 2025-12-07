import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
  try {
    const schoolProfile = await queryDB<any[]>(
      'SELECT * FROM school_profile LIMIT 1'
    );
    return NextResponse.json({
      schoolProfile: schoolProfile[0] || null
    });
  } catch (error) {
    console.error('Error fetching school profile:', error);
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
    const { school_name, address, phone, email, about, vision, mission } = body;
    const existing = await queryDB<any[]>(
      'SELECT id FROM school_profile LIMIT 1'
    );
    let result;
    if (existing.length > 0) {
      result = await queryDB(
        `UPDATE school_profile 
         SET school_name = ?, address = ?, phone = ?, email = ?, about = ?, vision = ?, mission = ?
         WHERE id = ?`,
        [school_name, address, phone, email, about, vision, mission, existing[0].id]
      );
    } else {
      result = await queryDB(
        `INSERT INTO school_profile (school_name, address, phone, email, about, vision, mission)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [school_name, address, phone, email, about, vision, mission]
      );
    }
    return NextResponse.json({
      message: 'Profil sekolah berhasil disimpan',
      success: true
    });
  } catch (error) {
    console.error('Error saving school profile:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}