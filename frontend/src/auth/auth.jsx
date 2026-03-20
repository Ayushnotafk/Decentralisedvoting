import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await api.me(token)
        if (!cancelled) setUser(data.user)
      } catch (e) {
        if (!cancelled) {
          setUser(null)
          setTokenState(null)
          setToken(null)
          setError(e?.message || 'Auth error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const value = useMemo(() => {
    return {
      user,
      token,
      loading,
      error,
      isAuthed: Boolean(user && token),
      register: async ({ name, email, password }) => {
        const data = await api.register({ name, email, password })
        setTokenState(data.token)
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      login: async ({ email, password }) => {
        const data = await api.login({ email, password })
        setTokenState(data.token)
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      logout: () => {
        setTokenState(null)
        setToken(null)
        setUser(null)
      },
    }
  }, [user, token, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

