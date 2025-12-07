import { queryDB } from '@/lib/db';
import Link from 'next/link';
export default async function AdminDashboard() {
  const activitiesCount = await queryDB<any[]>(
    'SELECT COUNT(*) as count FROM activities'
  );
  const achievementsCount = await queryDB<any[]>(
    'SELECT COUNT(*) as count FROM achievements'
  );
  const staffCount = await queryDB<any[]>(
    'SELECT COUNT(*) as count FROM staff'
  );
  const usersCount = await queryDB<any[]>(
    'SELECT COUNT(*) as count FROM users'
  );
  const stats = [
    { name: 'Total Kegiatan', value: activitiesCount[0]?.count || 0, href: '/admin/activities' },
    { name: 'Total Prestasi', value: achievementsCount[0]?.count || 0, href: '/admin/achievements' },
    { name: 'Staf & Guru', value: staffCount[0]?.count || 0, href: '/admin/staff' },
    { name: 'Pengguna Terdaftar', value: usersCount[0]?.count || 0, href: '/admin' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <Link
                href={stat.href}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Lihat →
              </Link>
            </div>
          </div>
        ))}
      </div>
      {}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/activities/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Tambah Kegiatan
          </Link>
          <Link
            href="/admin/achievements/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Tambah Prestasi
          </Link>
          <Link
            href="/admin/staff/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            + Tambah Staf/Guru
          </Link>
          <Link
            href="/admin/profile"
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Edit Profil Sekolah
          </Link>
        </div>
      </div>
      {}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-center py-4">
            Panel aktivitas akan menampilkan perubahan terbaru di website
          </p>
          <div className="text-sm text-gray-500">
            <p>• Login admin terakhir: Hari ini</p>
            <p>• Total kunjungan website: 0</p>
            <p>• Kegiatan terakhir ditambahkan: -</p>
          </div>
        </div>
      </div>
    </div>
  );
}