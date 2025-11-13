'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // ✅ Import Link disini
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginForm() {
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
    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Penting untuk cookies
    })

    if (res.ok) {
      // Ambil session untuk redirect berdasarkan role
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      
      if (session.user?.role === 'ADMIN') {
        router.push('/dashboard/admin')
      } else if (session.user?.role === 'GURU') {
        router.push('/dashboard/guru')
      } else {
        router.push('/')
      }
    } else {
      const data = await res.json()
      setError(data.error || 'Login gagal')
    }
  } catch (err) {
    setError('Terjadi kesalahan')
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
      
      <Button type="submit" disabled={isLoading}> {/* ✅ Sekarang disabled prop jalan */}
        {isLoading ? 'Sedang login...' : 'Login'}
      </Button>
      
      <div className="text-center">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-green-600 hover:text-green-800">
            Daftar disini
          </Link>
        </p>
      </div>
    </form>
  )
}