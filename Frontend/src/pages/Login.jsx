import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiLogIn, FiCheckCircle } from 'react-icons/fi'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import FloatingInput from '../components/FloatingInput'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    if (params.get('registered') === '1') {
      setSuccess('Account created successfully — please sign in.')
    }
  }, [params])

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      loginUser(data)
      navigate(data.role === 'TRADER' ? '/trader/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card dark:bg-gray-800 dark:border-gray-700 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue shopping</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <FloatingInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
            required
            autoComplete="email"
          />
          <FloatingInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <FiLogIn /> {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-brand-600 hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}