import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>
  }

  // Ambil data untuk statistik (dummy dulu)
  const totalKegiatan = 15
  const totalPrestasi = 8
  const totalGuru = 12
  const totalUser = 45

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang, {session.user?.nama}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Kegiatan</p>
              <p className="text-3xl font-bold mt-1">{totalKegiatan}</p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Prestasi</p>
              <p className="text-3xl font-bold mt-1">{totalPrestasi}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Guru & Staf</p>
              <p className="text-3xl font-bold mt-1">{totalGuru}</p>
            </div>
            <div className="text-4xl">👨‍🏫</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total User</p>
              <p className="text-3xl font-bold mt-1">{totalUser}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Kegiatan Terbaru</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <div className="mt-1 text-green-500">📅</div>
                <div>
                  <h3 className="font-medium">Kegiatan {item}</h3>
                  <p className="text-gray-600 text-sm">15 November 2025</p>
                  <p className="text-gray-500 mt-1">Deskripsi kegiatan yang dilakukan...</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Prestasi Terbaru</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <div className="mt-1 text-yellow-500">⭐</div>
                <div>
                  <h3 className="font-medium">Prestasi {item}</h3>
                  <p className="text-gray-600 text-sm">Juara 1 Olimpiade Sains</p>
                  <p className="text-gray-500 mt-1">Siswa: Budi Santoso</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}