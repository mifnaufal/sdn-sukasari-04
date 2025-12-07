import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
export async function GET() {
  try {
    const achievements = await queryDB(
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