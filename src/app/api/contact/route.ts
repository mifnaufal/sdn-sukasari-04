import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validasi input
const contactSchema = z.object({
  nama: z.string().min(3),
  email: z.string().email(),
  subjek: z.string().min(5),
  pesan: z.string().min(10)
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = contactSchema.parse(body)
    
    // Simpan ke database
    const contact = await prisma.contact.create({
       {
        nama: validated.nama,
        email: validated.email,
        subjek: validated.subjek,
        pesan: validated.pesan
      }
    })
    
    // TODO: Kirim email ke admin (opsional)
    
    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera membalas.'
    })
    
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim pesan. Silakan coba lagi.' },
      { status: 400 }
    )
  }
}