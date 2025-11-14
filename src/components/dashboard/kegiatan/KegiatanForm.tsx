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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // Validasi judul
    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul wajib diisi'
      isValid = false
    } else if (formData.judul.length < 5) {
      newErrors.judul = 'Judul minimal 5 karakter'
      isValid = false
    }

    // Validasi deskripsi
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi wajib diisi'
      isValid = false
    } else if (formData.deskripsi.length < 10) {
      newErrors.deskripsi = 'Deskripsi minimal 10 karakter'
      isValid = false
    }

    // Validasi tanggal
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi'
      isValid = false
    } else {
      const date = new Date(formData.tanggal)
      if (isNaN(date.getTime())) {
        newErrors.tanggal = 'Format tanggal tidak valid'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    if (!validateForm()) {
      toast.error('Perbaiki data yang masih error')
      return
    }

    setIsSubmitting(true)

    try {
      // Konversi tanggal ke format ISO yang valid untuk Zod
      const dateObj = new Date(formData.tanggal)
      const isoDate = dateObj.toISOString() // Format: YYYY-MM-DDTHH:mm:ss.sssZ

      const res = await fetch('/api/kegiatan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          foto: fotoUrl,
          tanggal: isoDate // Format ISO yang valid
        })
      })

      const response = await res.json()

      if (res.ok) {
        toast.success('Kegiatan berhasil ditambahkan! 🎉')
        setFormData({ judul: '', deskripsi: '', tanggal: '' })
        setFotoUrl('')
      } else {
        // Tangani error validation dari server
        if (response.error?.issues) {
          const validationErrors: Record<string, string> = {}
          response.error.issues.forEach((issue: any) => {
            validationErrors[issue.path[0]] = issue.message
          })
          setErrors(validationErrors)
          toast.error('Perbaiki data sesuai validasi')
        } else {
          throw new Error(response.error || 'Gagal menambahkan kegiatan')
        }
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
    
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tambah Kegiatan Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Judul Kegiatan"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              required
              placeholder="Contoh: Upacara Bendera"
            />
            {errors.judul && (
              <p className="text-red-500 text-sm mt-1">{errors.judul}</p>
            )}
          </div>
          
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.tanggal 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500'
              }`}
              required
            />
            {errors.tanggal && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
            )}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.deskripsi 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="Deskripsi lengkap kegiatan..."
          />
          {errors.deskripsi && (
            <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
          )}
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
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⌛</span>
                Menyimpan...
              </span>
            ) : 'Simpan Kegiatan'}
          </Button>
        </div>
      </form>
    </div>
  )
}