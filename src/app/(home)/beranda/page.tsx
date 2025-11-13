import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Selamat Datang di SDN Sukasari 04
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sekolah dasar yang mencetak generasi penerus bangsa dengan pendidikan berkualitas
          </p>
          <Link href="/register">
            <Button>Daftar Sekarang</Button>
          </Link>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi</h2>
            <p className="text-gray-600">
              Menjadi sekolah dasar unggulan yang menghasilkan lulusan berkarakter, berprestasi, dan berakhlak mulia.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Memberikan pendidikan yang berkualitas dan merata</li>
              <li>Mengembangkan karakter siswa yang berakhlak mulia</li>
              <li>Menumbuhkan semangat belajar dan kreativitas</li>
              <li>Membangun lingkungan sekolah yang nyaman dan kondusif</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kegiatan Terbaru */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kegiatan Terbaru</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat berbagai kegiatan menarik yang dilakukan oleh siswa dan guru kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
                  {/* Placeholder image */}
                  <div className="bg-green-100 flex items-center justify-center h-full">
                    <span className="text-green-600 font-medium">Foto Kegiatan</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Judul Kegiatan {item}</h3>
                <p className="text-gray-600 mb-4">
                  Deskripsi singkat kegiatan yang dilakukan oleh siswa SDN Sukasari 04.
                </p>
                <Link href={`/kegiatan/${item}`} className="text-green-600 hover:text-green-800 font-medium">
                  Baca Selengkapnya →
                </Link>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/kegiatan">
              <Button variant="secondary">Lihat Semua Kegiatan</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Prestasi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prestasi Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Berbagai prestasi yang telah diraih oleh siswa dan sekolah kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="text-center p-6">
              <div className="text-4xl font-bold text-green-600 mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prestasi {item}</h3>
              <p className="text-gray-600">
                Juara 1 lomba cerdas cermat tingkat kota
              </p>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/prestasi">
            <Button variant="secondary">Lihat Semua Prestasi</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}