import { http } from 'viem'
import { mainnet, polygon, sepolia } from 'viem/chains'
import { createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const chains = [sepolia, polygon, mainnet]

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
})

