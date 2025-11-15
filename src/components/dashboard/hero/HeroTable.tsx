'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Image from 'next/image'
interface HeroImage {
  id: string
  url: string
  caption: string | null
  active: boolean
  order: number
  createdAt: Date
}
export default function HeroTable({ heroImages }: { 
  heroImages: HeroImage[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    heroImages.reduce((acc, img) => ({ ...acc, [img.id]: img.active }), {})
  )
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus hero image ini?')) return
    setLoadingId(id)
    try {
      const res = await fetch('/api/hero', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        toast.success('Hero image berhasil dihapus! ✅')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus hero image')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Terjadi kesalahan saat menghapus')
    } finally {
      setLoadingId(null)
    }
  }
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setLoadingId(id)
    try {
      const newActive = !currentActive
      setActiveStates(prev => ({ ...prev, [id]: newActive }))
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, active: newActive })
      })
      if (!res.ok) {
        setActiveStates(prev => ({ ...prev, [id]: currentActive }))
        const data = await res.json()
        throw new Error(data.error || 'Gagal update status')
      }
    } catch (error) {
      console.error('Toggle active error:', error)
      toast.error('Gagal mengubah status aktif')
      setActiveStates(prev => ({ ...prev, [id]: currentActive }))
    } finally {
      setLoadingId(null)
    }
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preview
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Caption
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Urutan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {heroImages.map((image) => (
            <tr key={image.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-24 w-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image.url.startsWith('/') ? image.url : `/${image.url}`} 
                    alt={image.caption || 'Hero image'}
                    className="h-full w-full object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{image.caption || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {image.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleActive(image.id, activeStates[image.id])}
                  disabled={loadingId === image.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeStates[image.id]
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${loadingId === image.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {activeStates[image.id] ? 'Aktif' : 'Nonaktif'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button 
                  variant="secondary" 
                  onClick={() => handleDelete(image.id)}
                  disabled={loadingId === image.id}
                >
                  {loadingId === image.id ? 'Hapus...' : 'Hapus'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}