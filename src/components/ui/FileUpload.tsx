'use client'

import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import Button from './Button'

export default function FileUpload({ 
  onUploadSuccess, 
  currentFile 
}: { 
  onUploadSuccess: (url: string) => void 
  currentFile?: string 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File terlalu besar! Maksimal 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diizinkan')
      return
    }

    setIsUploading(true)
    setPreviewUrl(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onUploadSuccess(data.url)
        toast.success('Upload berhasil! 🎉')
      } else {
        throw new Error(data.error || 'Upload gagal')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload gagal. Coba lagi!')
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUploadSuccess, previewUrl])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Button variant="secondary" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Pilih Gambar'}
              </Button>
            </div>
          </label>
        </div>
        {currentFile && (
          <div className="text-sm text-gray-600">
            File saat ini: {currentFile.split('/').pop()}
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <div className="relative w-32 h-32">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}