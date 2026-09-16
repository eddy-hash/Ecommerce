import { useRef, useState } from 'react'
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi'

export default function ImageUploader({ file, onChange, existingUrl = null, error = null }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(existingUrl ? `/api/files/${existingUrl}` : null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { alert('Please choose an image file'); return }
    if (f.size > 5 * 1024 * 1024) { alert('File too large (max 5 MB)'); return }
    onChange(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const clear = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
          dragging ? 'border-brand-500 bg-brand-50' : error ? 'border-red-300 bg-red-50' : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 hover:bg-gray-50 dark:bg-gray-900'
        }`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clear() }}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 text-red-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-brand-100 rounded-full flex items-center justify-center">
              <FiUploadCloud className="w-8 h-8 text-brand-600" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, WEBP, GIF · Max 5 MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {file && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
          <FiImage /> {file.name} ({(file.size / 1024).toFixed(0)} KB)
        </p>
      )}
    </div>
  )
}