import { FiCheck } from 'react-icons/fi'

export default function VerifiedBadge({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  return (
    <span
      className={`${sizes[size]} inline-flex items-center justify-center rounded-full bg-brand-600 text-white flex-shrink-0 ${className}`}
      title="Verified Trader"
      aria-label="Verified Trader"
    >
      <FiCheck className="w-[70%] h-[70%]" strokeWidth={4} />
    </span>
  )
}