import { useEffect, useState } from 'react'
import { api } from '../auth/api.js'
import { useAuth } from '../auth/auth.jsx'

export default function Admin() {
  const { user, token } = useAuth()
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  async function loadPending() {
    if (!token) return
    setLoading(true)
    setErr(null)
    try {
      const data = await api.adminPendingVerifications(token)
      setPending(data.pending || [])
    } catch (e) {
      setErr(e?.message || 'Failed to load pending verifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') loadPending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  async function approve(email) {
    try {
      await api.adminApproveVerification({ email }, token)
      await loadPending()
    } catch (e) {
      alert(e?.message || 'Approve failed')
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
          Admin · Create election
        </h1>
        <p className="text-sm text-[var(--text)]">
          Frontend-only form for now. Next we’ll wire this to your smart contract
          (create election + add candidates + timestamps).
        </p>
      </div>

      <form className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Election name</span>
          <input
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder="e.g., Society President Election"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Category</span>
          <select className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
            <option>College</option>
            <option>Society</option>
            <option>National mock</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Voting start</span>
          <input
            type="datetime-local"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span className="font-semibold text-[var(--text-h)]">Voting end</span>
          <input
            type="datetime-local"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)] md:col-span-2">
          <span className="font-semibold text-[var(--text-h)]">Candidates</span>
          <textarea
            rows={4}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
            placeholder={"One per line, e.g.\nAlice\nBob\nCharlie"}
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-4 py-2 font-semibold text-[#0b2b1b]"
            onClick={() => alert('Next: connect this to the smart contract.')}
          >
            Create election
          </button>
          <button
            type="button"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 font-semibold text-[var(--text-h)]"
            onClick={() => alert('Next: allow uploading manifestos to IPFS.')}
          >
            Add candidate details (IPFS)
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[var(--text-h)]">
              Verification approvals
            </div>
            <div className="text-sm text-[var(--muted)]">
              Approve pending voters so they can cast votes.
            </div>
          </div>
          {!isAdmin ? (
            <div className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--text)]">
              Admin only
            </div>
          ) : (
            <div className="rounded-full border border-[var(--accent)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--accent)]">
              You are admin
            </div>
          )}
        </div>

        {!isAdmin ? null : (
          <div className="mt-4">
            {err ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            {loading ? (
              <div className="mt-3 text-sm text-[var(--muted)]">Loading pending…</div>
            ) : pending.length === 0 ? (
              <div className="mt-3 text-sm text-[var(--muted)]">
                No pending verifications right now.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
                <div className="grid grid-cols-3 gap-0 border-b border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Wallet</div>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {pending.map((u) => (
                    <div
                      key={u.id}
                      className="grid grid-cols-3 px-5 py-4 text-sm"
                    >
                      <div className="text-[var(--text-h)] font-semibold">{u.name}</div>
                      <div className="text-[var(--text)]">{u.email}</div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[var(--muted)] truncate">{u.walletAddress ?? '—'}</div>
                        <button
                          type="button"
                          className="rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-3 py-2 font-semibold text-[#0b2b1b] whitespace-nowrap"
                          onClick={() => approve(u.email)}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

