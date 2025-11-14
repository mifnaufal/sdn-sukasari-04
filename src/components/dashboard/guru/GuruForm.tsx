'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import FileUpload from '@/components/ui/FileUpload'

export default function GuruForm() {
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    deskripsi: ''
  })
  const [fotoUrl, setFotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/guru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          foto: fotoUrl
        })
      })

      if (res.ok) {
        toast.success('Guru berhasil ditambahkan! 👨‍🏫')
        setFormData({ nama: '', jabatan: '', deskripsi: '' })
        setFotoUrl('')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Gagal menambahkan guru')
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
      <h2 className="text-xl font-semibold mb-4">Tambah Guru/Staf Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nama Lengkap"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            placeholder="Contoh: Budi Santoso, S.Pd"
          />
          
          <Input
            label="Jabatan"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            required
            placeholder="Contoh: Guru Kelas, Kepala Sekolah"
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium mb-1">
            Deskripsi/Bio Singkat
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Deskripsi singkat tentang guru ini..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Foto Guru
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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Guru'}
          </Button>
        </div>
      </form>
    </div>
  )
}