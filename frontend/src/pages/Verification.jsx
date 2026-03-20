import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { api } from '../auth/api.js'
import { useAuth } from '../auth/auth.jsx'

export default function Verification() {
  const { user, token } = useAuth()
  const { address, isConnected } = useAccount()
  const navigate = useNavigate()

  const [idType, setIdType] = useState('college')
  const [idNumber, setIdNumber] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState(null)

  const walletAddress = useMemo(() => address?.toLowerCase() ?? null, [address])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!token) return
      setLoading(true)
      setErr(null)
      try {
        const data = await api.verificationStatus(token)
        if (!cancelled) setStatus(data.status)
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load status')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  async function submit(e) {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    setErr(null)
    try {
      await api.verificationRequest(
        { idType, idNumber, walletAddress: walletAddress ?? undefined },
        token,
      )
      setStatus('pending')
    } catch (e2) {
      setErr(e2?.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
          Voter verification (off-chain)
        </h1>
        <p className="text-sm text-[var(--text)]">
          Submit your college ID / Aadhaar-like info. Admin must approve before you
          can vote.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          Loading status…
        </div>
      ) : status === 'verified' ? (
        <div className="rounded-2xl border border-[var(--accent)] bg-[var(--surface)] p-5">
          <div className="text-sm font-semibold text-[var(--text-h)]">
            Verified ✅
          </div>
          <p className="mt-1 text-sm text-[var(--text)]">
            You can now go to the voting page.
          </p>
          <button
            type="button"
            className="mt-3 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-4 py-2 font-semibold text-[#0b2b1b]"
            onClick={() => navigate('/vote')}
          >
            Go to Vote
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[var(--text-h)]">
                Current status: {status ?? 'unsubmitted'}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">
                Wallet: {walletAddress ? walletAddress : 'not connected'}
              </div>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--text)]">
              Verified required for voting
            </div>
          </div>

          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label className="grid gap-2 text-sm text-[var(--text)] md:col-span-1">
              <span className="font-semibold text-[var(--text-h)]">ID type</span>
              <select
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
              >
                <option value="college">College ID</option>
                <option value="aadhaar">Aadhaar</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--text)] md:col-span-1">
              <span className="font-semibold text-[var(--text-h)]">
                ID number (demo)
              </span>
              <input
                required
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g., 1234567890"
              />
            </label>

            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Wallet auto-link (optional)
              </div>
              <div className="mt-2 text-sm text-[var(--text)]">
                {isConnected ? (
                  <span>
                    Connected: <span className="font-semibold">{walletAddress}</span>
                  </span>
                ) : (
                  <span>Connect wallet from the header for best results.</span>
                )}
              </div>
            </div>

            {err ? (
              <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !idNumber}
                className={[
                  'rounded-xl px-4 py-2 font-semibold',
                  'bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[#0b2b1b]',
                  'disabled:cursor-not-allowed disabled:opacity-70',
                ].join(' ')}
              >
                {submitting ? 'Submitting…' : 'Request verification'}
              </button>
              <button
                type="button"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 font-semibold text-[var(--text-h)] hover:bg-[var(--surface)]"
                onClick={() => navigate('/vote')}
              >
                Go to Vote
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

