import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/auth.jsx'
import { api } from '../auth/api.js'

const demoElection = {
  id: 'demo-1',
  name: 'Society President Election',
  category: 'Society',
  status: 'Open',
  candidates: [
    { id: 'c1', name: 'Alice' },
    { id: 'c2', name: 'Bob' },
    { id: 'c3', name: 'Charlie' },
  ],
}

export default function Vote() {
  const [selected, setSelected] = useState(null)
  const canSubmit = useMemo(() => Boolean(selected), [selected])
  const { token } = useAuth()
  const navigate = useNavigate()

  const [verificationStatus, setVerificationStatus] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!token) return
      setLoadingStatus(true)
      try {
        const data = await api.verificationStatus(token)
        if (!cancelled) setVerificationStatus(data.status)
      } catch {
        if (!cancelled) setVerificationStatus('unverified')
      } finally {
        if (!cancelled) setLoadingStatus(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const canVote = !loadingStatus && verificationStatus === 'verified'

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
          Vote casting
        </h1>
        <p className="text-sm text-[var(--text)]">
          This is the UI flow. Next we’ll enforce one-wallet-one-vote using contract +
          backend verification.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        {!canVote ? (
          <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm">
            {loadingStatus ? (
              <div>Checking verification status…</div>
            ) : (
              <div className="space-y-2">
                <div>
                  You are not verified yet. Voting is disabled until admin approves
                  your verification.
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-4 py-2 font-semibold text-[#0b2b1b]"
                  onClick={() => navigate('/verification')}
                >
                  Go to Verification
                </button>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-[var(--text-h)]">
              {demoElection.name}
            </div>
            <div className="text-sm text-[var(--muted)]">
              Category: {demoElection.category} · Status: {demoElection.status}
            </div>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--text)]">
            One wallet = one vote
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {demoElection.candidates.map((c) => {
            const active = selected === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={[
                  'rounded-2xl border p-4 text-left transition',
                  active
                    ? 'border-[var(--accent)] bg-[var(--bg)] shadow'
                    : 'border-[var(--border)] bg-[var(--bg)] hover:shadow',
                ].join(' ')}
              >
                <div className="text-base font-bold text-[var(--text-h)]">
                  {c.name}
                </div>
                <div className="mt-1 text-sm text-[var(--text)]">
                  Candidate ID: {c.id}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canSubmit || !canVote}
            className={[
              'rounded-xl px-4 py-2 font-semibold',
              canSubmit
                ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[#0b2b1b]'
                : 'cursor-not-allowed border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]',
            ].join(' ')}
            onClick={() => alert('Next: send vote transaction via smart contract.')}
          >
            Submit vote
          </button>
          <div className="text-sm text-[var(--muted)]">
            Selected: {selected ?? '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

