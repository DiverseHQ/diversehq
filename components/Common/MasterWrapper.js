import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotifyProvider } from './NotifyContext'
import { WalletProvider } from './WalletContext'
import RainbowKitWrapper from './RainbowKitWrapper'
import CustomPopUpModalProvider from './CustomPopUpProvider'
import LensUserContextProvider from '../../lib/LensUserContext'
import LexicalWrapper from './LexicalWrapper'
import ThemeProvider from './ThemeProvider'
import PostIndexingWrapper from '../Post/IndexingContext/PostIndexingWrapper'
import LivepeerProvider from '../Common/LivepeerProvider'
import OnlyAdmins from '../Common/UI/OnlyAdmins'

const queryClient = new QueryClient()

const MasterWrapper = ({ children }) => {
  return (
    <RainbowKitWrapper>
      <NotifyProvider>
        <QueryClientProvider client={queryClient}>
          <LensUserContextProvider>
            <WalletProvider>
              <ThemeProvider>
                <LivepeerProvider>
                  <LexicalWrapper>
                    <PostIndexingWrapper>
                      <CustomPopUpModalProvider>
                        <OnlyAdmins>{children}</OnlyAdmins>
                      </CustomPopUpModalProvider>
                    </PostIndexingWrapper>
                  </LexicalWrapper>
                </LivepeerProvider>
              </ThemeProvider>
            </WalletProvider>
          </LensUserContextProvider>
        </QueryClientProvider>
      </NotifyProvider>
    </RainbowKitWrapper>
  )
}

export default MasterWrapper
