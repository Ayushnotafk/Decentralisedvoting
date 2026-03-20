import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => location.state?.from ?? '/', [location.state])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState(null)

  return (
    <div className="mx-auto grid w-full max-w-[520px] gap-4">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-h)]">
          Login
        </h1>
        <p className="text-sm text-[var(--text)]">
          For now this is frontend-only. Later we’ll connect it to your Node/Mongo
          verification backend.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)]"
        onSubmit={async (e) => {
          e.preventDefault()
          setSubmitting(true)
          setErr(null)
          try {
            await login({ email, password })
            navigate(from, { replace: true })
          } catch (e2) {
            setErr(e2?.message || 'Login failed')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-4 py-2 font-semibold text-[#0b2b1b] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Logging in…' : 'Login'}
        </button>

        {err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="text-center text-sm text-[var(--muted)]">
          New here?{' '}
          <Link className="font-semibold text-[var(--accent)] underline" to="/register">
            Create account
          </Link>
        </div>
      </form>
    </div>
  )
}

