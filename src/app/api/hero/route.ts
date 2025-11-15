import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validasi input
const heroImageSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
})

export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: { 
        active: true 
      },
      orderBy: { 
        order: 'asc' 
      }
    })
    
    return NextResponse.json(heroImages)
  } catch (error) {
    console.error('GET hero images error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa buat hero image
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const validated = heroImageSchema.parse(body)
    
    const heroImage = await prisma.heroImage.create({
      data: {
        url: validated.url,
        caption: validated.caption || '',
        active: validated.active,
        order: validated.order
      }
    })
    
    return NextResponse.json(heroImage, { status: 201 })
  } catch (error) {
    console.error('POST hero image error:', error)
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa edit hero image
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id, ...data } = await req.json()
    const validated = heroImageSchema.parse(data)
    
    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        url: validated.url,
        caption: validated.caption || '',
        active: validated.active,
        order: validated.order
      }
    })
    
    return NextResponse.json(heroImage)
  } catch (error) {
    console.error('PUT hero image error:', error)
    return NextResponse.json(
      { error: 'Failed to update hero image' },
      { status: 400 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Proteksi: cuma admin yang bisa hapus hero image
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await req.json()
    
    await prisma.heroImage.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE hero image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero image' },
      { status: 400 }
    )
  }
}