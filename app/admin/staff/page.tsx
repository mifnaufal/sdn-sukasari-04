'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Staff } from '@/types';
export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  useEffect(() => {
    fetchStaff();
  }, []);
  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus staf ini?')) {
      return;
    }
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStaff(staff.filter(person => person.id !== id));
        alert('Staf berhasil dihapus!');
      } else {
        alert('Gagal menghapus staf');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Terjadi kesalahan');
    } finally {
      setDeleteLoading(null);
    }
  };
  if (loading) {
    return <p className="text-center py-8">Memuat data staf...</p>;
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Staf & Guru</h1>
        <Link
          href="/admin/staff/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
        >
          <span className="mr-2">+</span> Tambah Staf/Guru
        </Link>
      </div>
      {staff.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada data staf dan guru.</p>
          <Link
            href="/admin/staff/new"
            className="text-purple-600 hover:underline mt-2 inline-block"
          >
            Tambah staf pertama
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((person) => (
            <div key={person.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{person.position}</p>
                  {person.description && (
                    <p className="text-gray-600 text-sm mb-4">{person.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/staff/edit/${person.id}`}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(person.id)}
                    disabled={deleteLoading === person.id}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    {deleteLoading === person.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}