import { querySingle } from '@/lib/db';
import { SchoolProfile } from '@/types';
export default async function ProfilePage() {
  const schoolProfile = await querySingle<SchoolProfile>('SELECT * FROM school_profile LIMIT 1');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Profil SDN Sukasari 04
      </h1>
      {schoolProfile ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {schoolProfile.school_name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Alamat</h3>
                <p className="text-gray-600">{schoolProfile.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Kontak</h3>
                <p className="text-gray-600">Telepon: {schoolProfile.phone}</p>
                <p className="text-gray-600">Email: {schoolProfile.email}</p>
              </div>
            </div>
          </div>
          {}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Sekolah</h2>
            <p className="text-gray-700 whitespace-pre-line">{schoolProfile.about}</p>
          </div>
          {}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Visi</h2>
            <p className="text-gray-700 whitespace-pre-line">{schoolProfile.vision}</p>
          </div>
          {}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Misi</h2>
            <p className="text-gray-700 whitespace-pre-line">{schoolProfile.mission}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Data profil sekolah tidak ditemukan.</p>
          <p className="text-sm text-gray-400 mt-2">
            Silakan login sebagai admin untuk mengisi data profil.
          </p>
        </div>
      )}
    </div>
  );
}