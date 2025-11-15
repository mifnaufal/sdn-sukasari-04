import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default async function HomePage() {
  // Ambil hero images yang aktif dan diurutkan
  const heroImages = await prisma.heroImage.findMany({
    where: { 
      active: true 
    },
    orderBy: { 
      order: 'asc' 
    },
    take: 5
  })

  const defaultHero = {
    url: '/placeholder-hero.jpg',
    caption: 'Selamat datang di SDN Sukasari 04 - Sekolah Dasar Negeri Sukasari 04'
  }

  return (
    <div>
      {/* Hero Section with Carousel */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {heroImages.length > 0 ? (
            <div className="relative h-[500px] md:h-[600px]">
              {heroImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ zIndex: heroImages.length - index }}
                >
                  <div className="relative h-full">
                    <img 
                      src={image.url.startsWith('/') ? image.url : `/${image.url}`} 
                      alt={image.caption || 'Hero image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center px-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                          SDN Sukasari 04
                        </h1>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                          {image.caption || 'Sekolah dasar yang mencetak generasi penerus bangsa dengan pendidikan berkualitas'}
                        </p>
                        <Link href="/daftar">
                          <Button>Daftar Sekarang</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {heroImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-3 w-3 rounded-full ${
                        index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[500px] md:h-[600px]">
              <div className="absolute inset-0 bg-green-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏫</div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    SDN Sukasari 04
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    {defaultHero.caption}
                  </p>
                  <Link href="/daftar">
                    <Button>Daftar Sekarang</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
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
    </div>
  )
}