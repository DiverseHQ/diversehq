import React from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'
import RainbowKitWrapper from './RainbowKitWrapper'
import CustomPopUpModalProvider from './CustomPopUpProvider'
import LensUserContextProvider from '../../lib/LensUserContext'
import LexicalWrapper from './LexicalWrapper'

const queryClient = new QueryClient()

const MasterWrapper = ({ children }) => {
  return (
    <RainbowKitWrapper>
      <NotifyProvider>
        <QueryClientProvider client={queryClient}>
          <LensUserContextProvider>
            <WalletProvider>
              <ThemeProvider defaultTheme="light">
                <LexicalWrapper>
                  <CustomPopUpModalProvider>
                    {children}
                  </CustomPopUpModalProvider>
                </LexicalWrapper>
              </ThemeProvider>
            </WalletProvider>
          </LensUserContextProvider>
        </QueryClientProvider>
      </NotifyProvider>
    </RainbowKitWrapper>
  )
}

export default MasterWrapper
