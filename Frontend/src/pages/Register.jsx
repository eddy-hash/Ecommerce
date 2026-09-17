import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiShoppingBag, FiMail, FiLock, FiCheck } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import { authApi } from '../api/authApi'

function RoleStep({ data, update }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { value: 'CUSTOMER', icon: FiUser, titleKey: 'auth.customer', textKey: 'auth.customerDesc' },
        { value: 'TRADER',   icon: FiShoppingBag, titleKey: 'auth.trader', textKey: 'auth.traderDesc' },
      ].map((r) => (
        <button key={r.value} type="button" onClick={() => update({ role: r.value })}
          className={`p-6 rounded-2xl border-2 text-left transition ${data.role === r.value ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
          <r.icon className={`w-8 h-8 mb-3 ${data.role === r.value ? 'text-brand-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-white">{t(r.titleKey)}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t(r.textKey)}</p>
        </button>
      ))}
    </div>
  )
}

function AccountStep({ data, update }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <FloatingInput id="name" label={t('auth.fullName')} value={data.name || ''}
        onChange={(e) => update({ name: e.target.value })} icon={FiUser} required autoComplete="name" />
      <FloatingInput id="email" label={t('auth.email')} type="email" value={data.email || ''}
        onChange={(e) => update({ email: e.target.value })} icon={FiMail} required autoComplete="email" />
      <FloatingInput id="password" label={t('auth.password')} type="password" value={data.password || ''}
        onChange={(e) => update({ password: e.target.value })} icon={FiLock} required autoComplete="new-password" />
    </div>
  )
}

function DoneStep() {
  const { t } = useTranslation()
  return (
    <div className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('auth.accountCreated')}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{t('auth.redirecting')}</p>
    </div>
  )
}

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleComplete = async (data) => {
    setError('')
    try {
      await authApi.register(data)
      setDone(true)
      setTimeout(() => navigate('/login?registered=1'), 1400)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  const steps = done
    ? [{ label: 'Done', title: 'All set!', subtitle: '', component: DoneStep }]
    : [
        { label: 'Role',    title: t('auth.chooseRole'),     subtitle: '', component: RoleStep,    validate: (d) => !!d.role },
        { label: 'Account', title: t('auth.createAccount'),  subtitle: '', component: AccountStep, validate: (d) => d.name && d.email && d.password && d.password.length >= 4 },
        { label: 'Done',    title: t('auth.accountCreated'), subtitle: '', component: DoneStep },
      ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>
      )}
      <Wizard steps={steps} onComplete={handleComplete} submitLabel={t('auth.createAccount')} />
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('auth.haveAccount')} <Link to="/login" className="text-brand-600 hover:underline font-medium">{t('nav.login')}</Link>
      </p>
    </div>
  )
}