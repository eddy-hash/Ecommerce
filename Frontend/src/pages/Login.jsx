import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import FloatingInput from '../components/FloatingInput'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      loginUser(data)
      if (data.role === 'TRADER') navigate('/trader/dashboard'); else if (data.role === 'ADMIN') navigate('/admin'); else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('auth.welcomeBack')}</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">{t('auth.signInSubtitle')}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <FloatingInput
            id="email"
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
            required
            autoComplete="email"
          />
          <FloatingInput
            id="password"
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <FiLogIn /> {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t('auth.noAccount')} <Link to="/register" className="text-brand-600 hover:underline font-medium">{t('nav.register')}</Link>
        </p>
      </motion.div>
    </div>
  )
}