import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validasi input
const kegiatanSchema = z.object({
  judul: z.string().min(5),
  deskripsi: z.string().min(10),
  tanggal: z.string().datetime(),
})

export async function GET() {
  try {
    const kegiatan = await prisma.kegiatan.findMany({
      orderBy: { tanggal: 'desc' },
      include: { dibuatOleh: { select: { nama: true } } }
    })
    
    return NextResponse.json(kegiatan)
  } catch (error) {
    console.error('GET kegiatan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin/guru yang bisa buat kegiatan
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'GURU')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Fix TypeScript error: pastikan email bukan null
  const userEmail = session.user.email || ''
  if (!userEmail || userEmail.trim() === '') {
    return NextResponse.json(
      { error: 'User email not found' },
      { status: 400 }
    )
  }

  try {
    const body = await req.json()
    const validated = kegiatanSchema.parse(body)
    
    const kegiatan = await prisma.kegiatan.create({
      data: {
        judul: validated.judul,
        deskripsi: validated.deskripsi,
        tanggal: new Date(validated.tanggal),
        foto: body.foto || '',
        userEmail: userEmail // ✅ Pastikan ini string, bukan null
      }
    })
    
    return NextResponse.json(kegiatan, { status: 201 })
  } catch (error) {
    console.error('POST kegiatan error:', error)
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin/guru yang bisa edit kegiatan
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'GURU')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Fix TypeScript error: pastikan email bukan null
  const userEmail = session.user.email || ''
  if (!userEmail || userEmail.trim() === '') {
    return NextResponse.json(
      { error: 'User email not found' },
      { status: 400 }
    )
  }

  try {
    const { id, ...data } = await req.json()
    const validated = kegiatanSchema.parse(data)
    
    const kegiatan = await prisma.kegiatan.update({
      where: { id },
      data: {
        judul: validated.judul,
        deskripsi: validated.deskripsi,
        tanggal: new Date(validated.tanggal),
        foto: data.foto || '',
        userEmail: userEmail // ✅ Pastikan ini string
      }
    })
    
    return NextResponse.json(kegiatan)
  } catch (error) {
    console.error('PUT kegiatan error:', error)
    return NextResponse.json(
      { error: 'Failed to update kegiatan' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa hapus kegiatan
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await req.json()
    
    await prisma.kegiatan.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE kegiatan error:', error)
    return NextResponse.json(
      { error: 'Failed to delete kegiatan' },
      { status: 400 }
    )
  }
}