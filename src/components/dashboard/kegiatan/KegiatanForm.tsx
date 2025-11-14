'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import FileUpload from '@/components/ui/FileUpload'

export default function KegiatanForm() {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: ''
  })
  const [fotoUrl, setFotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.tanggal) {
        toast.error('Tanggal wajib diisi')
        return
      }

      const res = await fetch('/api/kegiatan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          foto: fotoUrl,
          tanggal: formData.tanggal
        })
      })

      if (res.ok) {
        toast.success('Kegiatan berhasil ditambahkan! 🎉')
        setFormData({ judul: '', deskripsi: '', tanggal: '' })
        setFotoUrl('')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Gagal menambahkan kegiatan')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan. Coba lagi!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tambah Kegiatan Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Judul Kegiatan"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
            placeholder="Contoh: Upacara Bendera"
          />
          
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium mb-1">
              Tanggal Kegiatan
            </label>
            <input
              type="datetime-local"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium mb-1">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Deskripsi lengkap kegiatan..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Foto Kegiatan
          </label>
          <FileUpload 
            onUploadSuccess={setFotoUrl} 
            currentFile={fotoUrl} 
          />
          {fotoUrl && (
            <div className="mt-2">
              <p className="text-sm text-green-600">✓ Foto berhasil diupload</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kegiatan'}
          </Button>
        </div>
      </form>
    </div>
  )
}