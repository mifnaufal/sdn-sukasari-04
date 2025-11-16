'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Pesan berhasil dikirim! 🎉')
        setFormData({ nama: '', email: '', subjek: '', pesan: '' })
      } else {
        throw new Error(data.error || 'Gagal mengirim pesan')
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nama Lengkap"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          required
          placeholder="Contoh: Budi Santoso"
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="contoh@email.com"
        />
      </div>

      <Input
        label="Subjek"
        name="subjek"
        value={formData.subjek}
        onChange={handleChange}
        required
        placeholder="Contoh: Pertanyaan tentang PPDB"
      />

      <Textarea
        label="Pesan"
        name="pesan"
        value={formData.pesan}
        onChange={handleChange}
        required
        rows={6}
        placeholder="Tuliskan pesan Anda di sini..."
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
        </Button>
      </div>
    </form>
  )
}