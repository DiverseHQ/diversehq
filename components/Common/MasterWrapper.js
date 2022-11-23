import React from 'react'
import { ThemeProvider } from 'next-themes'
import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'
import RainbowKitWrapper from './RainbowKitWrapper'
import CustomPopUpModalProvider from './CustomPopUpProvider'

const MasterWrapper = ({ children }) => {
  return (
    <RainbowKitWrapper>
      <WalletProvider>
        <NotifyProvider>
          <ThemeProvider defaultTheme="light">
            <CustomPopUpModalProvider>{children}</CustomPopUpModalProvider>
          </ThemeProvider>
        </NotifyProvider>
      </WalletProvider>
    </RainbowKitWrapper>
  )
}

export default MasterWrapper
