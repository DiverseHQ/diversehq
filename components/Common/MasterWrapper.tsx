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
import LivepeerProvider from './LivepeerProvider'
import DeviceWrapper from './DeviceWrapper'
// import ErrorBoundary from './ErrorBoundary'

const queryClient = new QueryClient()

const MasterWrapper = ({ children }) => {
  return (
    // <ErrorBoundary>
    <RainbowKitWrapper>
      <NotifyProvider>
        <QueryClientProvider client={queryClient}>
          <LensUserContextProvider>
            <WalletProvider>
              <ThemeProvider>
                <LivepeerProvider>
                  <LexicalWrapper>
                    <DeviceWrapper>
                      <PostIndexingWrapper>
                        <CustomPopUpModalProvider>
                          {children}
                        </CustomPopUpModalProvider>
                      </PostIndexingWrapper>
                    </DeviceWrapper>
                  </LexicalWrapper>
                </LivepeerProvider>
              </ThemeProvider>
            </WalletProvider>
          </LensUserContextProvider>
        </QueryClientProvider>
      </NotifyProvider>
    </RainbowKitWrapper>
    // </ErrorBoundary>
  )
}

export default MasterWrapper
