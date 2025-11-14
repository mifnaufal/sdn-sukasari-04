import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validasi input
const prestasiSchema = z.object({
  nama: z.string().min(3),
  kategori: z.string().min(2),
  deskripsi: z.string().min(10),
  tahun: z.number().min(2000).max(2100),
})

export async function GET() {
  try {
    const prestasi = await prisma.prestasi.findMany({
      orderBy: { tahun: 'desc' }
    })
    
    return NextResponse.json(prestasi)
  } catch (error) {
    console.error('GET prestasi error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa buat prestasi
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const validated = prestasiSchema.parse(body)
    
    const prestasi = await prisma.prestasi.create({
      data: {
        nama: validated.nama,
        kategori: validated.kategori,
        deskripsi: validated.deskripsi,
        tahun: validated.tahun,
        foto: body.foto || ''
      }
    })
    
    return NextResponse.json(prestasi, { status: 201 })
  } catch (error) {
    console.error('POST prestasi error:', error)
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa edit prestasi
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id, ...data } = await req.json()
    const validated = prestasiSchema.parse(data)
    
    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: {
        nama: validated.nama,
        kategori: validated.kategori,
        deskripsi: validated.deskripsi,
        tahun: validated.tahun,
        foto: data.foto || ''
      }
    })
    
    return NextResponse.json(prestasi)
  } catch (error) {
    console.error('PUT prestasi error:', error)
    return NextResponse.json(
      { error: 'Failed to update prestasi' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa hapus prestasi
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await req.json()
    
    await prisma.prestasi.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE prestasi error:', error)
    return NextResponse.json(
      { error: 'Failed to delete prestasi' },
      { status: 400 }
    )
  }
}