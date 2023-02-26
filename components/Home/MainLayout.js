import React, { useState } from 'react'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import NewMobileTopNav from './NewMobileTopNav'
import RightSidebar from './RightSidebar'
import { Box, LinearProgress } from '@mui/material'
import CreatePostButton from '../Common/UI/CreatePostButton'
import useDevice from '../Common/useDevice'
import MainMsgModal from '../Messages/MainMsgModal'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useTheme } from '../Common/ThemeProvider'
// import MainMsgModal from '../Messages/MainMsgModal'

const MainLayout = ({ children, isLoading, isMobileView }) => {
  const [mobile, setMobile] = useState(isMobileView)
  // only show if mounted
  const { isMobile } = useDevice()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  React.useEffect(() => {
    if (typeof isMobile === 'undefined' || isMobileView) return
    setMobile(isMobile)
  }, [isMobile])

  const { theme } = useTheme()
  if (!mounted && process.env.NEXT_PUBLIC_NODE_MODE === 'development')
    return null
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={`${theme === 'dark' ? '#1a1a1b' : '#ffffff'}`}
        />
      </Head>

      {mobile && (
        <div className="text-p-text bg-s-bg min-h-screen noSelect">
          {mounted && <NewMobileTopNav />}
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '0px',
              zIndex: '49'
            }}
          >
            {isLoading && <LinearProgress />}
          </Box>
          {/* <MobileTopNav /> */}
          <div className={'pb-16'}>
            <CreatePostButton />
            {children}
          </div>
          <MainMsgModal isMobile={true} />
          {!router.pathname.startsWith('/p/') && <MobileBottomNav />}
        </div>
      )}
      {!mobile && (
        <div className="relative min-h-screen bg-p-bg">
          <Navbar />

          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '0px',
              zIndex: '100'
            }}
          >
            {isLoading && <LinearProgress />}
          </Box>

          <div className="flex flex-row">
            {/* <NewLeftSidebar /> */}
            <div className="relative flex-1 min-h-screen text-p-text">
              {/* <ScrollToTopButton /> */}
              {children}
            </div>
            <RightSidebar />
            <MainMsgModal />
          </div>
        </div>
      )}
    </>
  )
}

export default MainLayout
