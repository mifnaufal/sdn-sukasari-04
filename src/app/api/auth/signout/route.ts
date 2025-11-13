import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    // Clear session
    return NextResponse.redirect(new URL('/login?logout=true', process.env.NEXTAUTH_URL))
  }
  
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL))
}