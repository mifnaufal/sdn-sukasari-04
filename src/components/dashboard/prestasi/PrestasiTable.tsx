'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Prestasi } from '@prisma/client'

export default function PrestasiTable({ prestasi }: { 
  prestasi: Prestasi[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus prestasi ini?')) return

    setLoadingId(id)
    try {
      const res = await fetch('/api/prestasi', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        toast.success('Prestasi berhasil dihapus! ✅')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus prestasi')
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
            Nama Prestasi
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kategori
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tahun
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {prestasi.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{item.nama}</div>
              {item.foto && (
                <div className="mt-1">
                  <img 
                    src={item.foto.startsWith('/') ? item.foto : `/${item.foto}`} 
                    alt={item.nama} 
                    className="h-12 w-12 object-cover rounded"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.deskripsi}</p>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {item.kategori}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.tahun}
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