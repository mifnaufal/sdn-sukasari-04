'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterForm() {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect ke login setelah register sukses
        router.push('/login?registered=true')
      } else {
        setError(data.error || 'Registrasi gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <Input
        label="Nama Lengkap"
        type="text"
        id="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      
      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sedang daftar...' : 'Daftar'}
      </Button>
      
      <div className="text-center">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-800">
            Login disini
          </Link>
        </p>
      </div>
    </form>
  )
}