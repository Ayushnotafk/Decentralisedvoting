import { useMemo } from 'react'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { chains } from '../web3/wagmi.js'

function shortAddress(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()

  const chainName = useMemo(() => {
    const c = chains.find((x) => x.id === chainId)
    return c?.name ?? `Chain ${chainId}`
  }, [chainId])

  const injectedConnector = connectors[0]

  if (!isConnected) {
    return (
      <button
        type="button"
        className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold text-[var(--text-h)] hover:bg-[var(--surface)]"
        onClick={() => connect({ connector: injectedConnector })}
        disabled={isConnectPending}
        title="Connect MetaMask"
      >
        {isConnectPending ? 'Connecting…' : 'Connect wallet'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-xs font-semibold text-[var(--text-h)] md:block"
        value={String(chainId)}
        onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
        disabled={isSwitchPending}
        aria-label="Switch network"
      >
        {chains.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--text-h)] md:block">
        {chainName}
      </div>

      <button
        type="button"
        className="rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] px-3 py-2 text-sm font-semibold text-[#0b2b1b]"
        onClick={() => disconnect()}
        title={address}
      >
        {shortAddress(address)}
      </button>
    </div>
  )
}

