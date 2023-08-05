import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import LensUserContextProvider from '../../lib/LensUserContext'
import PostIndexingWrapper from '../Post/IndexingContext/PostIndexingWrapper'
import CustomPopUpModalProvider from './CustomPopUpProvider'
import DeviceWrapper from './DeviceWrapper'
import ErrorBoundary from './ErrorBoundary'
import LexicalWrapper from './LexicalWrapper'
import LivepeerProvider from './LivepeerProvider'
import { NotifyProvider } from './NotifyContext'
import RainbowKitWrapper from './RainbowKitWrapper'
import ThemeProvider from './ThemeProvider'
import { WalletProvider } from './WalletContext'

const queryClient = new QueryClient()

const MasterWrapper = ({ children }) => {
  return (
    <ErrorBoundary>
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
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <CustomPopUpModalProvider>
                              {children}
                            </CustomPopUpModalProvider>
                          </LocalizationProvider>
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
    </ErrorBoundary>
  )
}

export default MasterWrapper
