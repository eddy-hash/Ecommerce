import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { adminApi } from '../api/adminApi'
import Spinner from '../components/Spinner'
import VerifiedBadge from '../components/VerifiedBadge'
import Avatar from '../components/Avatar'

const FILTERS = ['all', 'customer', 'trader', 'admin']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    adminApi.users().then(setUsers).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleVerify = async (u) => {
    try {
      await adminApi.verify(u.id)
      toast.success(`${u.name} verification toggled`)
      load()
    } catch (e) {
      toast.error('Failed to toggle verification')
    }
  }

  const deleteUser = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    try {
      await adminApi.deleteUser(u.id)
      toast.success('User deleted')
      load()
    } catch (e) {
      toast.error('Failed to delete user')
    }
  }

  if (loading) return <Spinner size="lg" />

  const q = search.trim().toLowerCase()
  const filtered = users
    .filter(u => filter === 'all' || u.role?.toLowerCase() === filter)
    .filter(u => {
      if (!q) return true
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    })

  const counts = {
    all: users.length,
    customer: users.filter(u => u.role === 'CUSTOMER').length,
    trader: users.filter(u => u.role === 'TRADER').length,
    admin: users.filter(u => u.role === 'ADMIN').length,
  }

  const roleBadge = (role) => {
    const styles = {
      TRADER:   'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      ADMIN:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      CUSTOMER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    }
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${styles[role] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {users.length} total · {counts.trader} traders · {counts.customer} customers
          </p>
        </div>
      </div>

      {/* Toolbar: search + filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search — icon absolutely positioned, input padded on the left */}
        <div className="relative w-full sm:w-80 flex-shrink-0">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="input-field w-full !pl-10"
          />
        </div>

        {/* Filters — horizontal scroll on mobile, wrap on sm+ */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-1 overflow-x-auto sm:overflow-visible">
          <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap pb-1 sm:pb-0">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  filter === f
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="mt-6 space-y-2">
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            No users match your search
          </div>
        )}

        {filtered.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="card p-3 sm:p-4"
          >
            {/* Row: avatar + info on the left, actions on the right */}
            <div className="flex items-start sm:items-center gap-3">
              <Avatar user={u} size="md" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {u.name}
                  </p>
                  {u.verified && <VerifiedBadge size="sm" />}
                  {roleBadge(u.role)}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {u.email}
                </p>

                {/* Actions — full-width row on mobile, inline on sm+ */}
                <div className="mt-3 flex items-center gap-2 sm:hidden">
                  {u.role === 'TRADER' && (
                    <button
                      onClick={() => toggleVerify(u)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${
                        u.verified
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200'
                      }`}
                    >
                      {u.verified ? <><FiX className="w-4 h-4" /> Unverify</> : <><FiCheck className="w-4 h-4" /> Verify</>}
                    </button>
                  )}
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => deleteUser(u)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition active:scale-95"
                      title="Delete user"
                      aria-label={`Delete ${u.name}`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                {u.role === 'TRADER' && (
                  <button
                    onClick={() => toggleVerify(u)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 whitespace-nowrap ${
                      u.verified
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200'
                    }`}
                    title={u.verified ? 'Remove verification' : 'Verify this trader'}
                  >
                    {u.verified ? <><FiX className="w-4 h-4" /> Unverify</> : <><FiCheck className="w-4 h-4" /> Verify</>}
                  </button>
                )}
                {u.role !== 'ADMIN' && (
                  <button
                    onClick={() => deleteUser(u)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition active:scale-95"
                    title="Delete user"
                    aria-label={`Delete ${u.name}`}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}