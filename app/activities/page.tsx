import { queryDB } from '@/lib/db';
import { Activity } from '@/types';
export default async function ActivitiesPage() {
  const activities = await queryDB<Activity[]>(
    'SELECT * FROM activities ORDER BY date DESC'
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kegiatan Sekolah</h1>
      <p className="text-gray-600 mb-8">
        Berbagai kegiatan yang dilaksanakan di SDN Sukasari 04
      </p>
      {activities.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{activity.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(activity.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-4">
                  {activity.description}
                </p>
                <div className="text-sm text-gray-500">
                  Diposting: {new Date(activity.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada kegiatan yang ditampilkan.</p>
        </div>
      )}
    </div>
  );
}