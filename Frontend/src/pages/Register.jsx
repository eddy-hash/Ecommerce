import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiShoppingBag, FiMail, FiLock, FiCheck } from 'react-icons/fi'
import Wizard from '../components/Wizard'
import FloatingInput from '../components/FloatingInput'
import { authApi } from '../api/authApi'

function RoleStep({ data, update }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { value: 'CUSTOMER', icon: FiUser, title: 'Customer', text: 'Browse and buy products' },
        { value: 'TRADER',   icon: FiShoppingBag, title: 'Trader', text: 'Sell your products online' },
      ].map((r) => (
        <button key={r.value} type="button" onClick={() => update({ role: r.value })}
          className={`p-6 rounded-2xl border-2 text-left transition ${data.role === r.value ? 'border-brand-600 bg-brand-50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:border-gray-600'}`}>
          <r.icon className={`w-8 h-8 mb-3 ${data.role === r.value ? 'text-brand-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-white">{r.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.text}</p>
        </button>
      ))}
    </div>
  )
}

function AccountStep({ data, update }) {
  return (
    <div className="space-y-4">
      <FloatingInput
        id="name"
        label="Full name"
        value={data.name || ''}
        onChange={(e) => update({ name: e.target.value })}
        icon={FiUser}
        required
        autoComplete="name"
      />
      <FloatingInput
        id="email"
        label="Email address"
        type="email"
        value={data.email || ''}
        onChange={(e) => update({ email: e.target.value })}
        icon={FiMail}
        required
        autoComplete="email"
      />
      <FloatingInput
        id="password"
        label="Password"
        type="password"
        value={data.password || ''}
        onChange={(e) => update({ password: e.target.value })}
        icon={FiLock}
        required
        autoComplete="new-password"
      />
    </div>
  )
}

function DoneStep() {
  return (
    <div className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-10 h-10 text-green-600" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account created!</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting you to sign in...</p>
    </div>
  )
}

export default function Register() {
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
    ? [{ label: 'Done', title: 'All set!', subtitle: 'Your account is ready', component: DoneStep }]
    : [
        { label: 'Role',    title: 'Choose your role',    subtitle: 'How will you use ShopHub?',
          component: RoleStep,    validate: (d) => !!d.role },
        { label: 'Account', title: 'Create your account', subtitle: 'Just a few details',
          component: AccountStep, validate: (d) => d.name && d.email && d.password && d.password.length >= 4 },
        { label: 'Done',    title: 'All set!',            subtitle: 'Your account is ready',
          component: DoneStep },
      ]

  return (
    <div className="min-h-[80vh] py-12 px-4">
      {error && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      <Wizard steps={steps} onComplete={handleComplete} submitLabel="Create Account" />
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account? <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}