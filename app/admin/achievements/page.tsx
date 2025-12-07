'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Achievement } from '@/types';
export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  useEffect(() => {
    fetchAchievements();
  }, []);
  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
      return;
    }
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAchievements(achievements.filter(achievement => achievement.id !== id));
        alert('Prestasi berhasil dihapus!');
      } else {
        alert('Gagal menghapus prestasi');
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Terjadi kesalahan');
    } finally {
      setDeleteLoading(null);
    }
  };
  if (loading) {
    return <p className="text-center py-8">Memuat data prestasi...</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Prestasi</h1>
        <Link
          href="/admin/achievements/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <span className="mr-2">+</span> Tambah Prestasi
        </Link>
      </div>
      {achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada prestasi.</p>
          <Link
            href="/admin/achievements/new"
            className="text-green-600 hover:underline mt-2 inline-block"
          >
            Tambah prestasi pertama
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Judul</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Tipe</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="font-medium text-gray-800">{achievement.title}</div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 text-xs rounded ${
                      achievement.type === 'siswa' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {achievement.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-600">
                    {new Date(achievement.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-600 max-w-xs truncate">
                    {achievement.description}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/achievements/edit/${achievement.id}`}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        disabled={deleteLoading === achievement.id}
                        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        {deleteLoading === achievement.id ? 'Menghapus...' : 'Hapus'}
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