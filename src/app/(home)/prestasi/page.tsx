import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'

export default async function PrestasiPublicPage() {
  // Ambil semua prestasi
  const prestasi = await prisma.prestasi.findMany({
    orderBy: { tahun: 'desc' }
  })

  // Group by tahun
  const prestasiByYear = prestasi.reduce((acc, item) => {
    const year = item.tahun.toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(item)
    return acc
  }, {} as Record<string, typeof prestasi>)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Prestasi Sekolah
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Berbagai prestasi yang telah diraih oleh siswa SDN Sukasari 04
          </p>
        </div>

        {Object.entries(prestasiByYear).length > 0 ? (
          Object.entries(prestasiByYear).map(([year, items]) => (
            <div key={year} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tahun {year}
                </h2>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                  {items.length} Prestasi
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {item.foto ? (
                        <img 
                          src={item.foto.startsWith('/') ? item.foto : `/${item.foto}`} 
                          alt={item.nama} 
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="bg-green-50 flex items-center justify-center h-full">
                          <span className="text-green-600 text-4xl">🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                          {item.nama}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {item.kategori}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.deskripsi}
                      </p>
                      <Link 
                        href={`/prestasi/${item.id}`} 
                        className="text-green-600 hover:text-green-800 font-medium flex items-center"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Prestasi
            </h2>
            <p className="text-gray-600">
              Prestasi sekolah akan ditampilkan di sini setelah ditambahkan oleh admin
            </p>
          </div>
        )}
      </div>
    </div>
  )
}