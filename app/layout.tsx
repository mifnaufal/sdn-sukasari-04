import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'SDN Sukasari 04 - Sekolah Unggulan',
  description: 'Website resmi SDN Sukasari 04',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; {new Date().getFullYear()} SDN Sukasari 04. Semua hak dilindungi.</p>
        </footer>
      </body>
    </html>
  );
}