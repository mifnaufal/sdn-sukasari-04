'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

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
      // Gunakan signIn dari next-auth/react untuk credentials login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      // Debugging: log hasil signIn
      console.log('Sign in result:', result)

      if (result?.error) {
        setError('Email atau password salah')
        toast.error('Email atau password salah')
        return
      }

      // Ambil session setelah login sukses
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      
      console.log('Session data after login:', sessionData)

      // Cek session data
      if (!sessionData.user) {
        setError('Session tidak tersedia setelah login')
        toast.error('Session tidak tersedia setelah login')
        return
      }

      // Redirect berdasarkan role
      if (sessionData.user.role === 'ADMIN') {
        toast.success('Login admin berhasil! 🔑')
        router.push('/dashboard/admin')
      } else if (sessionData.user.role === 'GURU') {
        toast.success('Login guru berhasil! 👨‍🏫')
        router.push('/dashboard/guru')
      } else {
        toast.success('Login berhasil! 👋')
        router.push('/')
      }

    } catch (err) {
      console.error('Login error details:', err)
      setError('Terjadi kesalahan saat login. Silakan coba lagi.')
      toast.error('Terjadi kesalahan saat login')
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
        placeholder="contoh@email.com"
      />
      
      <Input
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="••••••••"
      />
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⏳</span>
            Sedang login...
          </span>
        ) : (
          'Login'
        )}
      </Button>
      
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link 
            href="/register" 
            className="text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            Daftar disini
          </Link>
        </p>
      </div>
    </form>
  )
}