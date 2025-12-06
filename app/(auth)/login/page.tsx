'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'guru') {
        router.push('/guru');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        <p className="mt-2 text-gray-600">Masuk ke akun Anda</p>
      </div>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar di sini
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
      {}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">Akun Demo:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Admin: admin@sukasari04.sch.id / admin123</li>
          <li>User: user@example.com / user123</li>
        </ul>
      </div>
    </div>
  );
}