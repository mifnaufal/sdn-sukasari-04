import { queryDB } from '@/lib/db';
import { Staff } from '@/types';
export default async function StaffPage() {
  const staff = await queryDB<Staff[]>(
    'SELECT * FROM staff ORDER BY position'
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Staf & Guru</h1>
      <p className="text-gray-600 mb-8">
        Tenaga pendidik dan kependidikan SDN Sukasari 04
      </p>
      {staff.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staff.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {person.name.charAt(0)}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{person.position}</p>
              {person.description && (
                <p className="text-gray-600 text-sm">{person.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada data staf dan guru.</p>
        </div>
      )}
    </div>
  );
}