import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
  params
}: {
  children: ReactNode
  params: { role: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const role = session.user?.role?.toLowerCase() || 'user'
  const currentPath = `/dashboard/${params.role}`

  // Role validation
  if (role !== params.role && role !== 'admin') {
    redirect(`/dashboard/${role}`)
  }

  const navItems = {
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin' },
    { label: 'Kegiatan', href: '/dashboard/admin/kegiatan' },
    { label: 'Prestasi', href: '/dashboard/admin/prestasi' },
    { label: 'Guru & Staf', href: '/dashboard/admin/guru' },
    { label: 'Hero Section', href: '/dashboard/admin/hero' },
    { label: 'Kontak', href: '/dashboard/admin/kontak' },
    { label: 'User Management', href: '/dashboard/admin/users' },
  ],
    guru: [
      { label: 'Dashboard', href: '/dashboard/guru' },
      { label: 'Kegiatan Kelas', href: '/dashboard/guru/kegiatan' },
      { label: 'Profil', href: '/dashboard/guru/profil' },
    ]
  }

  const items = navItems[role as keyof typeof navItems] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-50">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-700">
            Dashboard {role.toUpperCase()}
          </h1>
        </div>
        
        <nav className="p-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-3 px-4 rounded-lg mb-2 transition-colors ${
                currentPath === item.href
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="mt-8 pt-4 border-t">
            <Link
              href="/"
              className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              ← Kembali ke Website
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </form>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {params.role} Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {session.user?.nama} ({session.user?.role})
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}