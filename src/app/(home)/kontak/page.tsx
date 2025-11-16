import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ada pertanyaan atau butuh informasi? Kirim pesan kepada kami, dan kami akan segera merespons.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Kontak */}
          <div>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Form Kontak
              </h2>
              <ContactForm />
            </Card>
          </div>

          {/* Info Kontak */}
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Alamat Sekolah
                    </h3>
                    <p className="text-gray-600">
                      Jl. Sukasari No. 04<br />
                      Kelurahan Sukasari, Kecamatan Sukasari<br />
                      Kota Bandung, Jawa Barat 40123
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Telepon
                    </h3>
                    <p className="text-gray-600">
                      (022) 12345678 (Kantor)<br />
                      (022) 87654321 (Kepala Sekolah)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600">
                      info@sdnsukasari04.sch.id<br />
                      kepala@sdnsukasari04.sch.id
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Jam Operasional
                    </h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 07.00 - 15.00 WIB<br />
                      Sabtu: 07.00 - 12.00 WIB<br />
                      Minggu: Libur
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Maps Embed */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Lokasi Sekolah
              </h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 flex items-center justify-center h-full">
                  <div className="text-center">
                    <span className="text-6xl mb-4">📍</span>
                    <p className="text-lg font-medium text-gray-900">
                      Google Maps akan ditampilkan di sini
                    </p>
                    <p className="text-gray-600 mt-2">
                      (Implementasi Google Maps API bisa ditambahkan nanti)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}