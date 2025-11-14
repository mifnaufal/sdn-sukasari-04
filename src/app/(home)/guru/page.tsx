import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default async function GuruPublicPage() {
  // Ambil semua guru diurutkan berdasarkan jabatan prioritas
  const guru = await prisma.guru.findMany({
    orderBy: [
      { jabatan: 'asc' },
      { nama: 'asc' }
    ]
  })

  // Group by jabatan
  const guruByJabatan = guru.reduce((acc, item) => {
    if (!acc[item.jabatan]) {
      acc[item.jabatan] = []
    }
    acc[item.jabatan].push(item)
    return acc
  }, {} as Record<string, typeof guru>)

  // Urutan prioritas jabatan
  const jabatanOrder = ['Kepala Sekolah', 'Wakil Kepala Sekolah', 'Guru Kelas', 'Guru Mapel', 'Staf Administrasi']

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Guru & Staf Pengajar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kenali para pendidik dan staf yang berdedikasi di SDN Sukasari 04
          </p>
        </div>

        {Object.keys(guruByJabatan).length > 0 ? (
          jabatanOrder
            .filter(jabatan => guruByJabatan[jabatan])
            .map((jabatan) => (
              <div key={jabatan} className="mb-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-green-500 mr-2">👨‍🏫</span>
                    {jabatan}
                  </h2>
                  <div className="h-1 w-16 bg-green-500 mt-2"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guruByJabatan[jabatan].map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-32 md:h-32 flex-shrink-0">
                            {item.foto ? (
                              <img 
                                src={item.foto.startsWith('/') ? item.foto : `/${item.foto}`} 
                                alt={item.nama} 
                                className="w-32 h-32 object-cover rounded-full border-4 border-green-500 mx-auto md:mx-0"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-4xl mx-auto md:mx-0">
                                {item.nama.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{item.nama}</h3>
                            <div className="flex items-center mt-1">
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                {item.jabatan}
                              </span>
                            </div>
                            
                            {item.deskripsi && (
                              <p className="text-gray-600 mt-3 line-clamp-3">
                                {item.deskripsi}
                              </p>
                            )}
                            
                            <div className="mt-4 flex justify-center md:justify-start">
                              <Link 
                                href={`/guru/${item.id}`} 
                                className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                              >
                                Lihat Profil Lengkap →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Data Guru
            </h2>
            <p className="text-gray-600">
              Data guru akan ditampilkan di sini setelah ditambahkan oleh admin
            </p>
          </div>
        )}
      </div>
    </div>
  )
}