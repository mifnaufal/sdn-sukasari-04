import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
const userRoleSchema = z.object({
  userId: z.string(),
  newRole: z.enum(['USER', 'GURU', 'ADMIN'])
})
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  try {
    const body = await req.json()
    const validated = userRoleSchema.parse(body)
    if (validated.userId === session.user.id && validated.newRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Tidak bisa mengubah role diri sendiri' },
        { status: 400 }
      )
    }
    const updatedUser = await prisma.user.update({
      where: { id: validated.userId },
      data: { role: validated.newRole }
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('PUT users error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 400 }
    )
  }
}
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  try {
    const { userId } = await req.json()
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Tidak bisa menghapus akun diri sendiri' },
        { status: 400 }
      )
    }
    await prisma.user.delete({
      where: { id: userId }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE users error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 400 }
    )
  }
}