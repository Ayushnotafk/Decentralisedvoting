import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--text)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              On-chain voting + live results
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-h)] md:text-5xl">
              Decentralized Voting System
            </h1>
            <p className="max-w-prose text-[var(--text)]">
              Wallet login, one-wallet-one-vote, smart contract storage, and a clean
              dashboard for transparent results.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/vote"
                className="rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-4 py-2 font-semibold text-[#0b2b1b] shadow"
              >
                Cast vote
              </Link>
              <Link
                to="/results"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 font-semibold text-[var(--text-h)]"
              >
                View results
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="text-sm font-semibold text-[var(--text-h)]">
              Project feature set
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--text)]">
              <li>✅ MetaMask wallet login</li>
              <li>✅ Create election (admin)</li>
              <li>✅ Vote casting (one wallet = one vote)</li>
              <li>✅ On-chain vote storage</li>
              <li>✅ Live dashboard + charts</li>
              <li>✅ Audit trail (tx hash + explorer link)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Admin panel',
            body: 'Create elections, set start/end time, add candidates.',
            to: '/admin',
          },
          {
            title: 'Voting booth',
            body: 'Verified + wallet-connected users can vote once.',
            to: '/vote',
          },
          {
            title: 'Transparency',
            body: 'Every vote is visible on-chain with tx proof.',
            to: '/audit',
          },
        ].map((x) => (
          <Link
            key={x.title}
            to={x.to}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:shadow-[0_18px_55px_rgba(15,23,42,0.10)]"
          >
            <div className="text-base font-bold text-[var(--text-h)]">{x.title}</div>
            <div className="mt-1 text-sm text-[var(--text)]">{x.body}</div>
          </Link>
        ))}
      </section>
    </div>
  )
}

