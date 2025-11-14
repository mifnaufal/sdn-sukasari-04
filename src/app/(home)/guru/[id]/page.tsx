import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default async function GuruDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const guru = await prisma.guru.findUnique({
    where: { id: params.id }
  })

  if (!guru) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/guru" 
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          ← Kembali ke Daftar Guru
        </Link>
        
        <Card className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center lg:items-start">
              {guru.foto ? (
                <img 
                  src={guru.foto.startsWith('/') ? guru.foto : `/${guru.foto}`} 
                  alt={guru.nama} 
                  className="w-48 h-48 object-cover rounded-full border-4 border-green-500 mb-6"
                />
              ) : (
                <div className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-6xl mb-6">
                  {guru.nama.charAt(0)}
                </div>
              )}
              
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{guru.nama}</h1>
                <div className="mt-2 flex justify-center lg:justify-start">
                  <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-lg font-medium">
                    {guru.jabatan}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-green-500 mr-2">📝</span>
                Profil Lengkap
              </h2>
              
              {guru.deskripsi ? (
                <div className="prose prose-green max-w-none">
                  <p className="text-gray-600 text-lg whitespace-pre-line">
                    {guru.deskripsi}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Belum ada deskripsi lengkap untuk guru ini.
                </p>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-yellow-500 mr-2">💡</span>
                  Mengajar Sejak
                </h3>
                <p className="text-gray-600">
                  SDN Sukasari 04 • 2015 - Sekarang
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-blue-500 mr-2">🎓</span>
                  Pendidikan
                </h3>
                <p className="text-gray-600">
                  S1 Pendidikan Guru Sekolah Dasar • Universitas Pendidikan Indonesia
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Link href="/guru">
            <Button variant="secondary">
              Lihat Semua Guru
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}