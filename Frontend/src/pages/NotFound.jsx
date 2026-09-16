import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-brand-600">404</h1>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary flex items-center gap-2 mt-8">
        <FiHome /> Go Home
      </Link>
    </div>
  )
}