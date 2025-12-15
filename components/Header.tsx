'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetchUser();
  }, []);
const fetchUser = async () => {
  try {
    setTimeout(async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        console.log('🔐 Auth check status:', response.status);
        if (response.status === 401) {
          setUser(null);
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          console.log('👤 User logged in:', data.user.name);
        }
      } catch (error) {
        console.log('⚠️ Auth check failed (normal on first load)');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, 1000);
  } catch (error) {
    setLoading(false);
  }
};
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              SDN Sukasari 04
            </Link>
<nav className="hidden md:flex space-x-6">
  <Link href="/" className="text-gray-700 hover:text-blue-600">
    Beranda
  </Link>
  <Link href="/profile" className="text-gray-700 hover:text-blue-600">
    Profil
  </Link>
  <Link href="/activities" className="text-gray-700 hover:text-blue-600">
    Kegiatan
  </Link>
  <Link href="/achievements" className="text-gray-700 hover:text-blue-600">
    Prestasi
  </Link>
  <Link href="/staff" className="text-gray-700 hover:text-blue-600">
    Staf & Guru
  </Link>
</nav>
          </div>
          <div className="flex items-center spaconst fetchUser ce-x-4">
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {user.role}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Admin Panel
                  </Link>
                )}
                {user.role === 'guru' && (
                  <Link
                    href="/guru"
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Guru Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}