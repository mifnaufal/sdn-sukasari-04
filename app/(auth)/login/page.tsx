'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'admin@sukasari04.sch.id',
    password: '123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');
    console.log('🚀 LOGIN ATTEMPT STARTED...');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      if (!response.ok) {
        throw new Error(data.error || `Login gagal (${response.status})`);
      }
      setTimeout(() => {
  console.log('🚀 FORCE REDIRECT TO /admin');
  window.location.href = '/admin';
}, 100);
      console.log('🎯 Token received:', data.token?.substring(0, 30) + '...');
      setRedirecting(true);
      setTimeout(() => {
        console.log('🔀 REDIRECTING NOW...');
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.user.role === 'guru') {
          window.location.href = '/guru';
        } else {
          window.location.href = '/';
        }
      }, 300);
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('🔍 Login page mounted');
    console.log('🍪 Current cookies:', document.cookie);
  }, []);
  if (redirecting) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        <p className="mt-2 text-gray-600">SDN Sukasari 04</p>
      </div>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          ❌ {error}
        </div>
      )}
      {}
      <div className="bg-yellow-50 p-3 rounded-md text-sm">
        <p className="font-semibold">🔧 Testing Credentials:</p>
        <p>Email: <span className="font-mono">admin@sukasari04.sch.id</span></p>
        <p>Password: <span className="font-mono">123</span></p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="email@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔄 Memproses...' : 'Login'}
        </button>
      </form>
      <div className="text-center space-y-2">
        <p>
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar akun baru
          </Link>
        </p>
        <p>
          <Link href="/" className="text-gray-600 hover:underline">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}