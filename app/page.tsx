import Link from 'next/link';
import { queryDB, querySingle } from '@/lib/db';
import { Activity, Achievement, Staff, SchoolProfile } from '@/types';
const fallbackData = {
  activities: [] as Activity[],
  achievements: [] as Achievement[],
  staff: [] as Staff[],
  schoolProfile: null as SchoolProfile | null
};
export default async function HomePage() {
  try {
    const activities = await queryDB<Activity[]>(
      'SELECT * FROM activities ORDER BY date DESC LIMIT 3'
    ).catch(() => fallbackData.activities);
    const achievements = await queryDB<Achievement[]>(
      'SELECT * FROM achievements ORDER BY date DESC LIMIT 3'
    ).catch(() => fallbackData.achievements);
    const staff = await queryDB<Staff[]>(
      'SELECT * FROM staff LIMIT 4'
    ).catch(() => fallbackData.staff);
    const schoolProfile = await querySingle<SchoolProfile>(
      'SELECT * FROM school_profile LIMIT 1'
    ).catch(() => fallbackData.schoolProfile);
    return (
      <div className="container mx-auto px-4 py-8">
        {}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Selamat Datang di SDN Sukasari 04
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sekolah dasar unggulan yang berkomitmen untuk mengembangkan potensi siswa secara optimal dan membangun karakter yang baik.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/profile" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Profil Sekolah
            </Link>
            <Link 
              href="/activities" 
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Kegiatan Sekolah
            </Link>
            <Link 
              href="/achievements" 
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
            >
              Prestasi
            </Link>
          </div>
        </section>
        {}
        <section className="mb-12 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Visi Sekolah</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {schoolProfile?.vision || 'Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, berprestasi, dan berbudaya.'}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Misi Sekolah</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {schoolProfile?.mission || '1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan potensi siswa secara optimal\n3. Membangun karakter yang baik\n4. Meningkatkan prestasi akademik dan non-akademik'}
            </p>
          </div>
        </section>
        {}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Kegiatan Terbaru</h2>
            <Link href="/activities" className="text-blue-600 hover:text-blue-800">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(activity.date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-gray-700 line-clamp-3">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Belum ada kegiatan yang ditampilkan.</p>
              </div>
            )}
          </div>
        </section>
        {}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Prestasi Terbaru</h2>
            <Link href="/achievements" className="text-blue-600 hover:text-blue-800">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div key={achievement.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        achievement.type === 'siswa' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {achievement.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(achievement.date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-gray-700 line-clamp-3">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Belum ada prestasi yang ditampilkan.</p>
              </div>
            )}
          </div>
        </section>
        {}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Staf & Guru</h2>
            <Link href="/staff" className="text-blue-600 hover:text-blue-800">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.length > 0 ? (
              staff.map((person) => (
                <div key={person.id} className="text-center border rounded-lg p-4 hover:shadow-md transition">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                      {person.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800">{person.name}</h3>
                  <p className="text-blue-600 text-sm">{person.position}</p>
                  {person.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {person.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Belum ada data staf dan guru.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SDN Sukasari 04</h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Perhatian:</strong> Terjadi kesalahan dalam memuat data. Silakan coba beberapa saat lagi.
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Profil Sekolah</h3>
              <p className="text-gray-600">SDN Sukasari 04 adalah sekolah dasar negeri unggulan.</p>
              <Link href="/profile" className="text-blue-600 mt-2 inline-block">
                Baca selengkapnya →
              </Link>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Kegiatan</h3>
              <p className="text-gray-600">Berbagai kegiatan pendidikan dan ekstrakurikuler.</p>
              <Link href="/activities" className="text-blue-600 mt-2 inline-block">
                Lihat kegiatan →
              </Link>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Prestasi</h3>
              <p className="text-gray-600">Prestasi siswa dan sekolah dalam berbagai bidang.</p>
              <Link href="/achievements" className="text-blue-600 mt-2 inline-block">
                Lihat prestasi →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}