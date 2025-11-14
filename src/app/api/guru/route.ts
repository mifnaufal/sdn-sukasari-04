import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validasi input
const guruSchema = z.object({
  nama: z.string().min(3),
  jabatan: z.string().min(2),
  deskripsi: z.string().optional(),
})

export async function GET() {
  try {
    const guru = await prisma.guru.findMany({
      orderBy: { nama: 'asc' }
    })
    
    return NextResponse.json(guru)
  } catch (error) {
    console.error('GET guru error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa buat guru
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const validated = guruSchema.parse(body)
    
    const guru = await prisma.guru.create({
      data: {  // ✅ FIX: Tambahkan prop 'data' di sini
        nama: validated.nama,
        jabatan: validated.jabatan,
        deskripsi: validated.deskripsi || '',
        foto: body.foto || ''
      }
    })
    
    return NextResponse.json(guru, { status: 201 })
  } catch (error) {
    console.error('POST guru error:', error)
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa edit guru
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id, ...data } = await req.json()
    const validated = guruSchema.parse(data)
    
    const guru = await prisma.guru.update({
      where: { id },
      data: {  // ✅ FIX: Tambahkan prop 'data' di sini
        nama: validated.nama,
        jabatan: validated.jabatan,
        deskripsi: validated.deskripsi || '',
        foto: data.foto || ''
      }
    })
    
    return NextResponse.json(guru)
  } catch (error) {
    console.error('PUT guru error:', error)
    return NextResponse.json(
      { error: 'Failed to update guru' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa hapus guru
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await req.json()
    
    await prisma.guru.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE guru error:', error)
    return NextResponse.json(
      { error: 'Failed to delete guru' },
      { status: 400 }
    )
  }
}