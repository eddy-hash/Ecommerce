import { useState, useRef, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiShield, FiAlertCircle, FiArrowLeft, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import FloatingInput from '../components/FloatingInput'

const DEMO_OTP = '123456'
const MAX_ATTEMPTS = 2

export default function ResetPassword() {
  const [step, setStep] = useState('email') // email | otp | success | locked
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [redirect, setRedirect] = useState(false)
  const refs = useRef([])

  useEffect(() => {
    if (step === 'otp') refs.current[0]?.focus()
  }, [step])

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setStep('otp')
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    if (code === DEMO_OTP) {
      setError('')
      toast.success('Email verified')
      setStep('success')
      return
    }
    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_ATTEMPTS) {
      setStep('locked')
      return
    }
    setError('Incorrect OTP. Please try again.')
    setOtp(['', '', '', '', '', ''])
    refs.current[0]?.focus()
  }

  const handleChange = (i, value) => {
    const v = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
    if (error) setError('')
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      refs.current[5]?.focus()
      e.preventDefault()
    }
  }

  if (redirect) return <Navigate to="/login" replace />

  const remaining = MAX_ATTEMPTS - attempts

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>

      
      {step === 'email' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card w-full max-w-md mx-auto p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4 animate-soft-bounce">
              <FiMail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
              Enter the email associated with your account and we'll send a 6-digit verification code.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2.5">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <FloatingInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              icon={FiMail}
              required
              autoComplete="email"
            />

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
            >
              Send verification code
            </button>
          </form>
        </motion.div>
      )}

      
      {step === 'otp' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card w-full max-w-md mx-auto p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 animate-soft-bounce">
              <FiMail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Enter verification code
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              We sent a 6-digit code to{' '}
              <strong className="text-brand-600 dark:text-brand-400">{email}</strong>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2.5"
            >
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                {error}
                {remaining > 0 && (
                  <span className="block text-xs opacity-75 mt-0.5">
                    {remaining} {remaining === 1 ? 'attempt' : 'attempts'} remaining
                  </span>
                )}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleOtpSubmit}>
            <div className="flex gap-1.5 sm:gap-2 justify-center mb-7" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.some((d) => !d)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Verify code
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setOtp(['', '', '', '', '', '']); setError(''); refs.current[0]?.focus() }}
            className="mt-4 w-full text-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors"
          >
            Clear and try again
          </button>

          <button
            type="button"
            onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError('') }}
            className="mt-2 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Use a different email
          </button>
        </motion.div>
      )}

      
      {step === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card w-full max-w-md mx-auto p-6 sm:p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/30 animate-soft-bounce"
          >
            <FiMail className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Email verified
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Your email <strong className="text-brand-600 dark:text-brand-400">{email}</strong> has been verified successfully.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-left">
            <div className="flex items-start gap-3">
              <FiShield className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Security policy
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  For your security, password resets must be approved by an administrator.
                  Please contact <strong>admin@com</strong> with the email address
                  above to complete the reset.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setRedirect(true)}
            className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
          >
            Go to login
          </button>
        </motion.div>
      )}

      
      {step === 'locked' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card w-full max-w-md mx-auto p-6 sm:p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/30 animate-soft-bounce"
          >
            <FiLock className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Too many attempts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            We've blocked further verification attempts on this account for security reasons.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-left">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                  Contact administrator
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                  Please reach out to <strong>admin@com</strong> with the email
                  address <strong>{email}</strong> to reset your password manually.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setRedirect(true)}
            className="mt-6 w-full h-11 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold active:scale-[0.98] transition-all"
          >
            Return to login
          </button>
        </motion.div>
      )}

      {step !== 'success' && step !== 'locked' && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      )}
    </div>
  )
}