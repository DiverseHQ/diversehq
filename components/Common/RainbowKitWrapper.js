import React from 'react'

import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets
} from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    // process.env.NEXT_PUBLIC_ALCHEMY_ID
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider()
  ]
)

const web3Auth = ({ chains }) => ({
  id: 'web3auth',
  name: 'Web3Auth',
  iconUrl:
    'https://pbs.twimg.com/profile_images/1481186409231044610/JAe7k861_400x400.jpg',
  iconBackground: '#0c2f78',
  createConnector: () => {
    const connector = new Web3AuthConnector({
      chains,
      options: {
        enableLogging: true,
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID, // Get your own client id from https://dashboard.web3auth.io
        network: 'testnet', // web3auth network, "mainnet", "cyan", or "aqua"
        chainId: '80001' // chainId that you want to connect with
      }
    })

    return {
      connector,
      mobile: {
        getUri: async () => (await connector.getProvider()).connector.uri
      },
      qrCode: {
        getUri: async () => (await connector.getProvider()).connector.uri
      }
    }
  }
})

const connectors = connectorsForWallets([
  {
    groupName: 'Web2',
    wallets: [web3Auth({ chains })]
  },
  {
    groupName: 'Popular',
    wallets: [
      // wallet.rainbow({chains}),
      metaMaskWallet({ chains }),
      injectedWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ chains })
      // wallet.metaMask({ chains }),
      // wallet.walletConnect({ chains }),
      // wallet.coinbase({ chains })
    ]
  }
])

// default connectors
// const { connectors } = getDefaultWallets({
//   appName: 'DiverseHQ',
//   chains
// })

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const RainbowKitWrapper = ({ children }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains} theme={midnightTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default RainbowKitWrapper
