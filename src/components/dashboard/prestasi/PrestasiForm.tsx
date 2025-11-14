'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import FileUpload from '@/components/ui/FileUpload'

export default function PrestasiForm() {
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: '',
    tahun: new Date().getFullYear().toString()
  })
  const [fotoUrl, setFotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.tahun) {
        toast.error('Tahun wajib diisi')
        return
      }

      const res = await fetch('/api/prestasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          foto: fotoUrl,
          tahun: parseInt(formData.tahun)
        })
      })

      if (res.ok) {
        toast.success('Prestasi berhasil ditambahkan! 🎉')
        setFormData({ 
          nama: '', 
          kategori: '', 
          deskripsi: '', 
          tahun: new Date().getFullYear().toString() 
        })
        setFotoUrl('')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Gagal menambahkan prestasi')
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
      <h2 className="text-xl font-semibold mb-4">Tambah Prestasi Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nama Prestasi"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            placeholder="Contoh: Juara 1 Olimpiade Sains"
          />
          
          <Input
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            required
            placeholder="Contoh: Akademik, Olahraga, Seni"
          />
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
            placeholder="Deskripsi lengkap prestasi..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tahun"
            name="tahun"
            type="number"
            value={formData.tahun}
            onChange={handleChange}
            required
            placeholder={new Date().getFullYear().toString()}
            min="2000"
            max={new Date().getFullYear().toString()}
          />
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Foto Prestasi
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
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Prestasi'}
          </Button>
        </div>
      </form>
    </div>
  )
}