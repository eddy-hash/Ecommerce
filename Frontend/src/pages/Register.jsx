import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiMail, FiLock, FiCheck, FiX } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import SuccessModal from '../components/SuccessModal'
import { authApi } from '../api/authApi'

/* ---------- password strength ---------- */

const RULES = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper',  label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { key: 'lower',  label: 'One lowercase letter',  test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number',            test: (p) => /\d/.test(p) },
  { key: 'symbol', label: 'One symbol (!@#$…)',   test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function scorePassword(pw) {
  return RULES.reduce((n, r) => n + (r.test(pw) ? 1 : 0), 0)
}

const STRENGTH_META = [
  { label: '',         bar: 'bg-transparent', text: 'text-gray-400' },
  { label: 'Too weak', bar: 'bg-red-400',     text: 'text-red-500' },
  { label: 'Weak',     bar: 'bg-orange-400',  text: 'text-orange-500' },
  { label: 'Fair',     bar: 'bg-yellow-400',  text: 'text-yellow-600' },
  { label: 'Good',     bar: 'bg-lime-500',    text: 'text-lime-600' },
  { label: 'Strong',   bar: 'bg-green-500',   text: 'text-green-600' },
]

function PasswordStrength({ password }) {
  if (!password) return null

  const score = scorePassword(password)
  const meta = STRENGTH_META[score] ?? STRENGTH_META[0]

  return (
    <div className="mt-1 space-y-3">
      {/* Segmented bar */}
      <div className="flex gap-1.5">
        {RULES.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                i < score ? meta.bar : 'bg-transparent'
              }`}
              style={{ width: i < score ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Strength label */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">Password strength</span>
        <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
      </div>

      {/* Criteria checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {RULES.map((r) => {
          const ok = r.test(password)
          return (
            <li key={r.key} className="flex items-center gap-2 text-xs">
              <span
                className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                  ok
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {ok
                  ? <FiCheck className="w-2.5 h-2.5" strokeWidth={3} />
                  : <FiX className="w-2.5 h-2.5" strokeWidth={3} />}
              </span>
              <span className={ok ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>
                {r.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- steps ---------- */

function RoleStep({ data, update }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { value: 'CUSTOMER', icon: FiUser,        titleKey: 'auth.customer', textKey: 'auth.customerDesc' },
        { value: 'TRADER',   icon: FiShoppingBag, titleKey: 'auth.trader',   textKey: 'auth.traderDesc' },
      ].map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => update({ role: r.value })}
          className={`p-6 rounded-2xl border-2 text-left transition ${
            data.role === r.value
              ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          }`}
        >
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
      <FloatingInput
        id="name"
        label={t('auth.fullName')}
        value={data.name || ''}
        onChange={(e) => update({ name: e.target.value })}
        icon={FiUser}
        required
        autoComplete="name"
      />
      <FloatingInput
        id="email"
        label={t('auth.email')}
        type="email"
        value={data.email || ''}
        onChange={(e) => update({ email: e.target.value })}
        icon={FiMail}
        required
        autoComplete="email"
      />
      <FloatingInput
        id="password"
        label={t('auth.password')}
        type="password"
        value={data.password || ''}
        onChange={(e) => update({ password: e.target.value })}
        icon={FiLock}
        required
        autoComplete="new-password"
      />

      {/* Password strength meter — pure render, no side effects */}
      <PasswordStrength password={data.password || ''} />
    </div>
  )
}

/* ---------- page ---------- */

export default function Register() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const handleComplete = async (data) => {
    setError('')
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  if (redirect) return <Navigate to="/login?registered=1" replace />

  const steps = [
    {
      label: 'Role',
      title: t('auth.chooseRole'),
      subtitle: '',
      component: RoleStep,
      validate: (d) => !!d.role,
    },
    {
      label: 'Account',
      title: t('auth.createAccount'),
      subtitle: '',
      component: AccountStep,
      // Require score >= 3 (Fair) before submitting
      validate: (d) =>
        !!d.name &&
        !!d.email &&
        !!d.password &&
        scorePassword(d.password) >= 3,
    },
  ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Wizard
        steps={steps}
        onComplete={handleComplete}
        submitLabel={t('auth.createAccount')}
      />

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="text-brand-600 hover:underline font-medium">
          {t('nav.login')}
        </Link>
      </p>

      <SuccessModal
        isOpen={done}
        onClose={() => setRedirect(true)}
        title={t('auth.accountCreated')}
        message={t('auth.redirecting')}
        primaryLabel={t('nav.login')}
        onPrimary={() => setRedirect(true)}
      />
    </div>
  )
}