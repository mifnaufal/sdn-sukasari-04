import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Buat folder uploads jika belum ada
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Get form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validasi type file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Hanya file gambar yang diizinkan' },
        { status: 400 }
      )
    }

    // Validasi ukuran file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File terlalu besar! Maksimal 5MB' },
        { status: 400 }
      )
    }

    // Baca file sebagai buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate nama file random
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${randomBytes(16).toString('hex')}.${fileExtension.toLowerCase()}`
    
    // Simpan file
    const filePath = `/uploads/${fileName}`
    const absolutePath = join(process.cwd(), 'public', 'uploads', fileName)
    
    await writeFile(absolutePath, buffer)

    return NextResponse.json({
      success: true,
      url: filePath,
      name: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}