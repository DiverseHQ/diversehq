import React from 'react'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import NewMobileTopNav from './NewMobileTopNav'
import RightSidebar from './RightSidebar'
import { Box, LinearProgress } from '@mui/material'
import CreatePostButton from '../Common/UI/CreatePostButton'
import MainMsgModal from '../Messages/MainMsgModal'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useTheme } from '../Common/ThemeProvider'
import { useDevice } from '../Common/DeviceWrapper'
// import MainMsgModal from '../Messages/MainMsgModal'

const MainLayout = ({ children, isLoading, isMobileView }) => {
  const mobile = isMobileView
  // const [mobile, setMobile] = useState(isMobileView)
  // only show if mounted
  // const { isMobile } = useDevice()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const { setIsMobile } = useDevice()
  // React.useEffect(() => {
  //   if (typeof window === 'undefined') return
  //   if (!mobile) {
  //     setMobile(isMobile)
  //   }
  // }, [isMobile])

  React.useEffect(() => {
    setMounted(true)
    setIsMobile(isMobileView)
  }, [isMobileView])

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

      {!mounted && (
        // full screen with logo at center
        <div
          style={{ zIndex: 70 }}
          className="fixed w-full flex items-center justify-center h-screen bg-p-bg"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src="/LogoV3TrimmedWithBG.png"
              alt="logo"
              className="w-20 h-20 animate-bounce"
            />
            <div className="flex flex-row items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-p-text rounded-full"></div>
              <div className="w-3 h-3 bg-p-text rounded-full"></div>
              <div className="w-3 h-3 bg-p-text rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {mobile && (
        <div className="text-p-text bg-s-bg min-h-screen noSelect ">
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
        <div className="relative min-h-screen bg-p-bg ">
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

          <div className="flex flex-row justify-center space-x-12">
            {/* <NewLeftSidebar /> */}
            <div className="relative min-h-screen text-p-text">
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
