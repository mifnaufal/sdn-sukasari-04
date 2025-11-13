'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Debugging: Cek apakah session API jalan
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        console.log('Session API response:', data)
      } catch (error) {
        console.error('Session API check failed:', error)
      }
    }
    
    checkSession()
  }, [])

  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  )
}