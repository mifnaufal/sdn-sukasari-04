import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UserTable from '@/components/dashboard/users/UserTable'
import Card from '@/components/ui/Card'
export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
        <p className="text-gray-600 mt-1">
          Kelola semua user yang terdaftar di sistem
        </p>
      </div>
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total User</p>
              <p className="text-3xl font-bold mt-1">{users.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Guru Terdaftar</p>
              <p className="text-3xl font-bold mt-1">
                {users.filter(u => u.role === 'GURU').length}
              </p>
            </div>
            <div className="text-4xl">👨‍🏫</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Admin</p>
              <p className="text-3xl font-bold mt-1">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
            <div className="text-4xl">👑</div>
          </div>
        </Card>
      </div>
      {}
      <Card>
        <div className="overflow-x-auto">
          <UserTable users={users} />
        </div>
      </Card>
    </div>
  )
}