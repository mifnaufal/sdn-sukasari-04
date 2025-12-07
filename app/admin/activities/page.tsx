'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from '@/types';
export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  useEffect(() => {
    fetchActivities();
  }, []);
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      return;
    }
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setActivities(activities.filter(activity => activity.id !== id));
        alert('Kegiatan berhasil dihapus!');
      } else {
        alert('Gagal menghapus kegiatan');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Terjadi kesalahan');
    } finally {
      setDeleteLoading(null);
    }
  };
  if (loading) {
    return <p className="text-center py-8">Memuat data kegiatan...</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Kegiatan Sekolah</h1>
        <Link
          href="/admin/activities/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span> Tambah Kegiatan
        </Link>
      </div>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada kegiatan.</p>
          <Link
            href="/admin/activities/new"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Tambah kegiatan pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Judul</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="font-medium text-gray-800">{activity.title}</div>
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-600 max-w-xs truncate">
                    {activity.description}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/activities/edit/${activity.id}`}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        disabled={deleteLoading === activity.id}
                        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        {deleteLoading === activity.id ? 'Menghapus...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}