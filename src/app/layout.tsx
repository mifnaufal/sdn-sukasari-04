import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata = {
  title: 'SDN Sukasari 04',
  description: 'Website resmi Sekolah Dasar Negeri Sukasari 04',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="font-sans">
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}