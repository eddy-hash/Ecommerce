import { createContext, useContext, useEffect, useState } from 'react'
import { profileApi } from '../api/profileApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)

    if (token) {
      profileApi.me()
        .then((fresh) => {
          setUser((prev) => {
            const merged = { ...(prev || {}), ...fresh }
            localStorage.setItem('user', JSON.stringify(merged))
            return merged
          })
        })
        .catch(() => {})
    }
  }, [])

  const loginUser = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const updateUser = (patch) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...patch }
      localStorage.setItem('user', JSON.stringify(merged))
      return merged
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')  // clear cart on logout
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
