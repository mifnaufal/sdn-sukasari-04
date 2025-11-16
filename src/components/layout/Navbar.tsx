'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-green-700 font-bold text-xl">
              SDN Sukasari 04
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-green-600">Beranda</Link>
            <Link href="/kegiatan" className="text-gray-700 hover:text-green-600">Kegiatan</Link>
            <Link href="/prestasi" className="text-gray-700 hover:text-green-600">Prestasi</Link>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-green-600">Beranda</Link>
            <Link href="/kegiatan" className="block py-2 text-gray-700 hover:text-green-600">Kegiatan</Link>
            <Link href="/prestasi" className="block py-2 text-gray-700 hover:text-green-600">Prestasi</Link>
            <Link href="/guru" className="text-gray-700 hover:text-green-600">Guru & Staf</Link>
            <Link href="/kontak" className="text-gray-700 hover:text-green-600">Kontak</Link>
            <Link href="/login" className="block py-2">
              <Button>Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}