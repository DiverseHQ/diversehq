import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'

const LoginButton = () => {
  const { openConnectModal } = useConnectModal()
  return (
    <button
      className="text-2xl bg-p-h-bg py-4 px-10 rounded-full"
      onClick={openConnectModal}
    >
      Login
    </button>
  )
}

export default LoginButton
