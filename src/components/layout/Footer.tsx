export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Tentang Kami</h3>
            <p className="text-gray-300">
              SDN Sukasari 04 adalah sekolah dasar yang berkomitmen untuk memberikan pendidikan terbaik bagi generasi penerus bangsa.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📍 Jl. Sukasari No. 04, Kota Bandung</li>
              <li>📞 (022) 12345678</li>
              <li>📧 info@sdnsukasari04.sch.id</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Media Sosial</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SDN Sukasari 04. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}