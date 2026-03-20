const demoTx = [
  {
    ts: '2026-03-18 19:12',
    action: 'Vote cast',
    hash: '0x3f2c...9a11',
    chain: 'Sepolia',
  },
  {
    ts: '2026-03-18 19:09',
    action: 'Election created',
    hash: '0x91ab...40de',
    chain: 'Sepolia',
  },
]

function explorerUrl(chain, hash) {
  // Later: make this dynamic (Polygon, etc.)
  if (!hash?.startsWith('0x')) return null
  if (chain === 'Sepolia') return `https://sepolia.etherscan.io/tx/${hash}`
  return `https://etherscan.io/tx/${hash}`
}

export default function Audit() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
          Transparent audit trail
        </h1>
        <p className="text-sm text-[var(--text)]">
          Every important action is verifiable via transaction hash.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-4 gap-0 border-b border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          <div>Time</div>
          <div>Action</div>
          <div>Chain</div>
          <div>Transaction</div>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {demoTx.map((r) => {
            const url = explorerUrl(r.chain, r.hash)
            return (
              <div key={r.hash} className="grid grid-cols-4 px-5 py-4 text-sm">
                <div className="text-[var(--muted)]">{r.ts}</div>
                <div className="font-semibold text-[var(--text-h)]">{r.action}</div>
                <div className="text-[var(--text)]">{r.chain}</div>
                <div>
                  {url ? (
                    <a
                      className="font-semibold text-[var(--accent)] underline decoration-[var(--accent2)] underline-offset-4"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.hash}
                    </a>
                  ) : (
                    <span className="text-[var(--muted)]">{r.hash}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

