'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import FileUpload from '@/components/ui/FileUpload'
export default function HeroForm() {
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    active: true,
    order: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const captionValue = formData.caption.trim() === '' ? null : formData.caption
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          caption: captionValue
        })
      })
      if (res.ok) {
        toast.success('Hero image berhasil ditambahkan! 🎉')
        setFormData({ url: '', caption: '', active: true, order: 0 })
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Gagal menambahkan hero image')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan. Coba lagi!')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target
    if (target.type === 'checkbox') {
      const checkbox = target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [checkbox.name]: checkbox.checked
      }))
      return
    }
    const { name, value, type } = target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? parseInt(value) || 0 
        : value
    }))
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tambah Hero Image Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FileUpload 
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, url }))}
          currentFile={formData.url}
        />
        <Input
          label="Caption (Opsional)"
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          placeholder="Contoh: Selamat datang di SDN Sukasari 04"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-1">
              Urutan Tampil
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Angka lebih kecil akan muncul lebih dulu
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
              Aktifkan Gambar
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Hero Image'}
          </Button>
        </div>
      </form>
    </div>
  )
}