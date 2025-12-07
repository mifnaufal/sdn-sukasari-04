import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
export async function GET() {
  try {
    const activities = await queryDB(
      'SELECT * FROM activities ORDER BY date DESC'
    );
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}