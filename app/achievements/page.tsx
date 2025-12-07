import { queryDB } from '@/lib/db';
import { Achievement } from '@/types';
export default async function AchievementsPage() {
  const achievements = await queryDB<Achievement[]>(
    'SELECT * FROM achievements ORDER BY date DESC'
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Prestasi</h1>
      <p className="text-gray-600 mb-8">
        Prestasi yang diraih oleh siswa dan sekolah SDN Sukasari 04
      </p>
      {achievements.length > 0 ? (
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border-l-4 border-blue-500 bg-white p-5 shadow-sm rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{achievement.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    achievement.type === 'siswa' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {achievement.type === 'siswa' ? 'Prestasi Siswa' : 'Prestasi Sekolah'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(achievement.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{achievement.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada prestasi yang ditampilkan.</p>
        </div>
      )}
    </div>
  );
}