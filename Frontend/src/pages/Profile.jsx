import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiUser, FiMail, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../api/profileApi'
import FloatingInput from '../components/FloatingInput'
import Avatar from '../components/Avatar'
import VerifiedBadge from '../components/VerifiedBadge'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { t } = useTranslation()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { setName(user?.name || '') }, [user])

  const handleAvatar = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5 MB'); return }

    setUploading(true)
    try {
      const updated = await profileApi.uploadAvatar(file)
      updateUser(updated)
      toast.success('Profile photo updated')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const saveName = async () => {
    if (!name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const updated = await profileApi.updateName(name)
      updateUser(updated)
      toast.success('Name updated')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('nav.profile')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
          Manage your account information
        </p>

        {/* Avatar with badge overlay */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar user={user} size="xl" showBadge />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-md transition disabled:opacity-50 active:scale-95"
              aria-label="Change photo"
            >
              <FiCamera className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatar(e.target.files?.[0])}
            />
          </div>

          {/* Name with badge below avatar */}
          <div className="mt-4 flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            {user.verified && <VerifiedBadge size="md" />}
          </div>

          {/* Role badge */}
          <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'TRADER'
              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}>
            {user.role === 'TRADER' ? 'Trader account' : 'Customer account'}
            {user.verified && <span className="ml-1">· Verified</span>}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {uploading ? 'Uploading...' : 'Click the camera to change your photo'}
          </p>
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
            <FiMail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        {/* Name (editable) */}
        <div className="mb-4">
          <FloatingInput
            id="name"
            label={t('auth.fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={FiUser}
          />
        </div>

        <button
          onClick={saveName}
          disabled={saving || name === user.name}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4"
        >
          <FiCheck /> {saving ? 'Saving...' : 'Save changes'}
        </button>
      </motion.div>
    </div>
  )
}