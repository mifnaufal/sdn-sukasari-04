import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GuruTable from '@/components/dashboard/guru/GuruTable'
import GuruForm from '@/components/dashboard/guru/GuruForm'
import Card from '@/components/ui/Card'

export default async function GuruPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Ambil semua guru
  const guru = await prisma.guru.findMany({
    orderBy: { nama: 'asc' }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Guru & Staf</h1>
        <p className="text-gray-600 mt-1">
          Kelola data guru dan staf sekolah
        </p>
      </div>

      {/* Form Tambah/Edit Guru */}
      <Card>
        <GuruForm />
      </Card>

      {/* Tabel Guru */}
      <Card>
        <div className="overflow-x-auto">
          <GuruTable guru={guru} />
        </div>
      </Card>
    </div>
  )
}