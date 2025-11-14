'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
interface UserItem {
  id: string
  nama: string
  email: string
  role: string
  createdAt: Date
}
export default function UserTable({ users }: { 
  users: UserItem[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<Record<string, string>>({})
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Yakin ingin mengubah role user ini menjadi ${newRole}?`)) return
    setLoadingId(userId)
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newRole })
      })
      if (res.ok) {
        toast.success(`Role berhasil diubah menjadi ${newRole}! ✅`)
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal mengubah role')
      }
    } catch (error) {
      console.error('Role change error:', error)
      toast.error('Terjadi kesalahan saat mengubah role')
    } finally {
      setLoadingId(null)
    }
  }
  const handleDelete = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus akun user ini?')) return
    setLoadingId(userId)
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })
      if (res.ok) {
        toast.success('User berhasil dihapus! ✅')
        window.location.reload()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus user')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Terjadi kesalahan saat menghapus')
    } finally {
      setLoadingId(null)
    }
  }
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'GURU':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tanggal Daftar
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{user.nama}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                disabled={loadingId === user.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getRoleColor(user.role)
                } ${loadingId === user.id ? 'opacity-50' : ''}`}
              >
                <option value="USER">User</option>
                <option value="GURU">Guru</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(user.createdAt).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Button 
                variant="secondary" 
                onClick={() => handleDelete(user.id)}
                disabled={loadingId === user.id}
              >
                {loadingId === user.id ? 'Hapus...' : 'Hapus'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}