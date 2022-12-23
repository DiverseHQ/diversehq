import React from 'react'
import { ThemeProvider } from 'next-themes'
import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'
import RainbowKitWrapper from './RainbowKitWrapper'
import CustomPopUpModalProvider from './CustomPopUpProvider'

const MasterWrapper = ({ children }) => {
  return (
    <RainbowKitWrapper>
      <NotifyProvider>
        <WalletProvider>
          <ThemeProvider defaultTheme="light">
            <CustomPopUpModalProvider>{children}</CustomPopUpModalProvider>
          </ThemeProvider>
        </WalletProvider>
      </NotifyProvider>
    </RainbowKitWrapper>
  )
}

export default MasterWrapper
