import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import KegiatanTable from '@/components/dashboard/kegiatan/KegiatanTable'
import KegiatanForm from '@/components/dashboard/kegiatan/KegiatanForm'
import Card from '@/components/ui/Card'

export default async function KegiatanPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Ambil semua kegiatan
  const kegiatan = await prisma.kegiatan.findMany({
    orderBy: { tanggal: 'desc' },
    include: { dibuatOleh: { select: { nama: true } } }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kegiatan</h1>
        <p className="text-gray-600 mt-1">
          Kelola semua kegiatan sekolah
        </p>
      </div>

      {/* Form Tambah/Edit Kegiatan */}
      <Card>
        <KegiatanForm />
      </Card>

      {/* Tabel Kegiatan */}
      <Card>
        <div className="overflow-x-auto">
          <KegiatanTable kegiatan={kegiatan} />
        </div>
      </Card>
    </div>
  )
}