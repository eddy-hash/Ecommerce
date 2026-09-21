import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  required = false,
  autoComplete,
  as = 'input',
  rows = 4,
  inputMode,
  maxLength,
  placeholder,
  className: extraClass = '',
}) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const actualType = isPassword && showPassword ? 'text' : type

  const hasValue = value !== undefined && value !== null && value !== ''
  const floated = focused || hasValue

  const commonProps = {
    id,
    value: value ?? '',
    onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    required,
    autoComplete,
    inputMode,
    maxLength,
    placeholder,
    className: `peer w-full bg-transparent border-0 outline-none text-gray-900 dark:text-gray-100 pt-5 pb-2 ${
      Icon ? 'pl-11' : 'pl-3'
    } ${isPassword ? 'pr-11' : 'pr-3'}`,
  }

  return (
    <div className="relative">
      <div
        className={`relative rounded-lg border transition-all duration-200 ${
          focused
            ? 'border-brand-500 ring-2 ring-brand-500/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        {Icon && (
          <Icon
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-10 ${
              focused ? 'text-brand-600' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        )}

        {as === 'textarea' ? (
          <textarea {...commonProps} rows={rows} />
        ) : (
          <input {...commonProps} type={actualType} />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors z-10 ${
              focused
                ? 'text-brand-600 hover:text-brand-700'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        )}

        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 z-20 px-1.5 ${
            Icon ? 'left-10' : 'left-2'
          } ${
            floated
              ? 'top-0 -translate-y-1/2 text-xs font-medium bg-white dark:bg-gray-800 ' +
                (focused ? 'text-brand-600' : 'text-gray-500 dark:text-gray-400')
              : 'top-1/2 -translate-y-1/2 text-base text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
    </div>
  )
}