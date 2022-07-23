import React from 'react'
import { ThemeProvider } from 'next-themes'
import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'

const MasterWrapper = ({ children }) => {
  return (
    <WalletProvider>
        <NotifyProvider>
            <ThemeProvider defaultTheme = 'system'>
            {children}
            </ThemeProvider>
        </NotifyProvider>
    </WalletProvider>
  )
}

export default MasterWrapper
