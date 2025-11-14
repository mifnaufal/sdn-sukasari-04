'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Guru } from '@prisma/client'

export default function GuruTable({ guru }: { 
  guru: Guru[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data guru ini?')) return

    setLoadingId(id)
    try {
      const res = await fetch('/api/guru', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        toast.success('Data guru berhasil dihapus! ✅')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus data guru')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Terjadi kesalahan saat menghapus')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama Guru
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Jabatan
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Foto
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {guru.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{item.nama}</div>
              {item.deskripsi && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.deskripsi}
                </p>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {item.jabatan}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {item.foto ? (
                <div className="h-16 w-16">
                  <img 
                    src={item.foto.startsWith('/') ? item.foto : `/${item.foto}`} 
                    alt={item.nama} 
                    className="h-16 w-16 object-cover rounded-full border-2 border-green-500"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => alert('Edit fitur coming soon!')}>
                  Edit
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => handleDelete(item.id)}
                  disabled={loadingId === item.id}
                >
                  {loadingId === item.id ? 'Hapus...' : 'Hapus'}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}