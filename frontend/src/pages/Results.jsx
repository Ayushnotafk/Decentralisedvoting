import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const demo = {
  electionName: 'Society President Election',
  totalEligible: 120,
  votes: [
    { name: 'Alice', votes: 38 },
    { name: 'Bob', votes: 44 },
    { name: 'Charlie', votes: 21 },
  ],
}

export default function Results() {
  const totalVotes = useMemo(
    () => demo.votes.reduce((a, b) => a + b.votes, 0),
    [],
  )
  const turnout = useMemo(() => {
    const pct = demo.totalEligible ? (totalVotes / demo.totalEligible) * 100 : 0
    return Math.round(pct * 10) / 10
  }, [totalVotes])

  const winner = useMemo(() => {
    return [...demo.votes].sort((a, b) => b.votes - a.votes)[0]?.name ?? '—'
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
          Live results
        </h1>
        <p className="text-sm text-[var(--text)]">
          Demo data for UI. Next we’ll stream counts from the smart contract events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { k: 'Election', v: demo.electionName },
          { k: 'Total votes', v: String(totalVotes) },
          { k: 'Turnout %', v: `${turnout}%` },
        ].map((x) => (
          <div
            key={x.k}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="text-sm text-[var(--muted)]">{x.k}</div>
            <div className="mt-1 text-lg font-bold text-[var(--text-h)]">
              {x.v}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-3 text-sm font-semibold text-[var(--text-h)]">
            Candidate-wise votes (bar)
          </div>
          <div style={{ width: '100%', height: 280, minHeight: 280 }}>
            <ResponsiveContainer>
              <BarChart data={demo.votes}>
                <CartesianGrid stroke="rgba(15,23,42,0.10)" />
                <XAxis dataKey="name" stroke="rgba(71,85,105,0.85)" />
                <YAxis stroke="rgba(71,85,105,0.85)" allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="rgb(47 133 90)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-3 text-sm font-semibold text-[var(--text-h)]">
            Share of votes (pie)
          </div>
          <div style={{ width: '100%', height: 280, minHeight: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={demo.votes}
                  dataKey="votes"
                  nameKey="name"
                  outerRadius={95}
                  fill="rgb(47 133 90)"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-[var(--muted)]">
            Current winner: <span className="font-semibold">{winner}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

