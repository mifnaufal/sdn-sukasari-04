'use client';
import { useEffect } from 'react';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan!</h2>
      <p className="text-gray-600 mb-6">
        {error.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Coba Lagi
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Jika masalah berlanjut, hubungi administrator.
      </p>
    </div>
  );
}