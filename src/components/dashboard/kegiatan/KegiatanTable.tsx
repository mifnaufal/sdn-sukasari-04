'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Kegiatan } from '@prisma/client'

export default function KegiatanTable({ kegiatan }: { 
  kegiatan: (Kegiatan & { 
    dibuatOleh: { nama: string } 
  })[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return

    setLoadingId(id)
    try {
      const res = await fetch('/api/kegiatan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        toast.success('Kegiatan berhasil dihapus! ✅')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus kegiatan')
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
            Judul
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tanggal
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dibuat Oleh
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {kegiatan.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{item.judul}</div>
              {item.foto && (
                <div className="mt-1">
                  <img 
                    src={item.foto.startsWith('/') ? item.foto : `/${item.foto}`} 
                    alt={item.judul} 
                    className="h-12 w-12 object-cover rounded"
                  />
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(item.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.dibuatOleh?.nama || 'Tidak diketahui'}
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