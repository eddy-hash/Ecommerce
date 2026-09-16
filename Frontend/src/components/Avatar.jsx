import { FiUser } from 'react-icons/fi'

export default function Avatar({ user, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?'

  if (user?.avatarUrl) {
    return (
      <img
        src={`/api/files/${user.avatarUrl}`}
        alt={user.name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 ${className}`}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-brand-600 text-white flex items-center justify-center font-bold ${className}`}>
      {initial || <FiUser />}
    </div>
  )
}