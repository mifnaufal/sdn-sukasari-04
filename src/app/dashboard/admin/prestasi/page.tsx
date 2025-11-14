import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PrestasiTable from '@/components/dashboard/prestasi/PrestasiTable'
import PrestasiForm from '@/components/dashboard/prestasi/PrestasiForm'
import Card from '@/components/ui/Card'

export default async function PrestasiPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Ambil semua prestasi
  const prestasi = await prisma.prestasi.findMany({
    orderBy: { tahun: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Prestasi</h1>
        <p className="text-gray-600 mt-1">
          Kelola semua prestasi sekolah
        </p>
      </div>

      {/* Form Tambah/Edit Prestasi */}
      <Card>
        <PrestasiForm />
      </Card>

      {/* Tabel Prestasi */}
      <Card>
        <div className="overflow-x-auto">
          <PrestasiTable prestasi={prestasi} />
        </div>
      </Card>
    </div>
  )
}