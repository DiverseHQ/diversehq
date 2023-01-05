import { useConnectModal } from '@rainbow-me/rainbowkit'
import React, { useEffect, useState } from 'react'
import { useDisconnect, useSigner } from 'wagmi'
import { useProfile } from './WalletContext'

export const ActiveStatus = {
  CONNECT_WALLET: 'CONNECT_WALLET',
  SIGN_IN: 'SIGN_IN',
  DISCONNECT: 'DISCONNECT',
  LOADING: 'LOADING',
  PENDING: 'PENDING'
}

const ConnectWalletAndSignInButton = ({
  connectWalletLabel,
  SignInLabel,
  DisconnectLabel
}) => {
  const [activeStatus, setActiveStatus] = useState(ActiveStatus.CONNECT_WALLET)
  const { user, address, fetchWeb3Token, loading } = useProfile()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const { data: signer } = useSigner()

  useEffect(() => {
    if (loading) {
      setActiveStatus(ActiveStatus.LOADING)
    } else if (user) {
      setActiveStatus(ActiveStatus.DISCONNECT)
    } else if (address && signer) {
      setActiveStatus(ActiveStatus.SIGN_IN)
    } else {
      setActiveStatus(ActiveStatus.CONNECT_WALLET)
    }
  }, [user, address, signer, loading])

  return (
    <div>
      {activeStatus === ActiveStatus.CONNECT_WALLET && (
        <button
          className="bg-p-btn text-p-btn-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold"
          onClick={openConnectModal}
        >
          {connectWalletLabel}
        </button>
      )}
      {activeStatus === ActiveStatus.SIGN_IN && (
        <button
          className="bg-p-btn text-p-btn-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold"
          onClick={fetchWeb3Token}
        >
          {SignInLabel}
        </button>
      )}
      {activeStatus === ActiveStatus.DISCONNECT && (
        <button
          className="bg-p-btn text-p-btn-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold"
          onClick={disconnect}
        >
          {DisconnectLabel}
        </button>
      )}
      {activeStatus === ActiveStatus.LOADING && (
        <button
          className="bg-p-btn text-p-btn-text px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold"
          disabled
        >
          Loading...
        </button>
      )}
    </div>
  )
}

export default ConnectWalletAndSignInButton
