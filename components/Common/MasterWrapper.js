import React from 'react'
import { ThemeProvider } from 'next-themes'
import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'
import RainbowKitWrapper from './RainbowKitWrapper'

const MasterWrapper = ({ children }) => {
  return (
    <RainbowKitWrapper>
    <WalletProvider>
        <NotifyProvider>
            <ThemeProvider defaultTheme = 'system'>
            {children}
            </ThemeProvider>
        </NotifyProvider>
    </WalletProvider>
    </RainbowKitWrapper>
  )
}

export default MasterWrapper
