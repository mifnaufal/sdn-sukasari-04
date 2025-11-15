import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HeroTable from '@/components/dashboard/hero/HeroTable'
import HeroForm from '@/components/dashboard/hero/HeroForm'
import Card from '@/components/ui/Card'
export default async function HeroPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }
  const heroImages = await prisma.heroImage.findMany({
    orderBy: { 
      order: 'asc' 
    },
    select: {
      id: true,
      url: true,
      caption: true,
      active: true,
      order: true,
      createdAt: true
    }
  })
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Hero Section</h1>
        <p className="text-gray-600 mt-1">
          Kelola gambar utama yang muncul di halaman beranda
        </p>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Gambar</p>
              <p className="text-3xl font-bold mt-1">{heroImages.length}</p>
            </div>
            <div className="text-4xl">🖼️</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Gambar Aktif</p>
              <p className="text-3xl font-bold mt-1">
                {heroImages.filter(img => img.active).length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Gambar Terbaru</p>
              <p className="text-3xl font-bold mt-1">
                {heroImages.length > 0 
                  ? new Date(heroImages[0].createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short'
                    })
                  : '-'
                }
              </p>
            </div>
            <div className="text-4xl">🆕</div>
          </div>
        </Card>
      </div>
      {}
      <Card>
        <HeroForm />
      </Card>
      {}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Hero Images</h2>
          <div className="text-sm text-gray-500">
            Total: {heroImages.length} gambar
          </div>
        </div>
        <HeroTable heroImages={heroImages} />
      </Card>
    </div>
  )
}