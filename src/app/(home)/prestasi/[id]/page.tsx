import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default async function PrestasiDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const prestasi = await prisma.prestasi.findUnique({
    where: { id: params.id }
  })

  if (!prestasi) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/prestasi" 
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          ← Kembali ke Daftar Prestasi
        </Link>
        
        <Card className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              {prestasi.foto && (
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={prestasi.foto.startsWith('/') ? prestasi.foto : `/${prestasi.foto}`} 
                    alt={prestasi.nama} 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {prestasi.kategori}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">
                {prestasi.nama}
              </h1>
              <div className="flex items-center space-x-4 text-gray-500">
                <div className="flex items-center">
                  <span className="text-xl mr-2">📅</span>
                  <span className="font-medium">Tahun {prestasi.tahun}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Deskripsi
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {prestasi.deskripsi}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Link href="/prestasi">
            <Button variant="secondary">
              Lihat Semua Prestasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}