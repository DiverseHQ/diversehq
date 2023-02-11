import React, { useState } from 'react'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import NewMobileTopNav from './NewMobileTopNav'
import RightSidebar from './RightSidebar'
import ScrollToTopButton from '../Common/UI/ScrollToTopButton'
import NewLeftSidebar from './NewLeftSidebar'
import { Box, LinearProgress } from '@mui/material'
import CreatePostButton from '../Common/UI/CreatePostButton'
import useDevice from '../Common/useDevice'
// import MainMsgModal from '../Messages/MainMsgModal'

const MainLayout = ({ children, isLoading, isMobileView }) => {
  const [mobile, setMobile] = useState(isMobileView)
  // only show if mounted
  const { isMobile } = useDevice()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  React.useEffect(() => {
    if (typeof isMobile === 'undefined' || isMobileView) return
    setMobile(isMobile)
  }, [isMobile])
  if (!mounted && process.env.NEXT_PUBLIC_NODE_MODE === 'development')
    return null
  return (
    <>
      {mobile && (
        <div className="text-p-text bg-p-bg min-h-screen transition-all duration-500">
          {mounted && <NewMobileTopNav />}
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '50px',
              zIndex: '100'
            }}
          >
            {isLoading && <LinearProgress />}
          </Box>
          {/* <MobileTopNav /> */}
          <div className={'pb-16'}>
            <CreatePostButton />
            {children}
          </div>
          <MobileBottomNav />
        </div>
      )}
      {!mobile && (
        <div className="relative min-h-screen bg-p-bg transition-all duration-500">
          <Navbar />

          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '60px',
              zIndex: '100'
            }}
          >
            {isLoading && <LinearProgress />}
          </Box>

          <div className="flex flex-row">
            <NewLeftSidebar />
            <div className="relative flex-1 min-h-screen text-p-text">
              <ScrollToTopButton />
              {children}
            </div>
            <RightSidebar />
            {/* <MainMsgModal /> */}
          </div>

          {/* <div
            className="hidden lg:flex flex-col fixed z-50 bottom-0 right-0 drop-shadow-2xl flex flex-row justify-between bg-s-bg text-p-text py-2 px-6 rounded-t-[15px] w-[160px] md:w-[220px] lg:w-[320px] xl:w-[380px] cursor-pointer"
            onClick={() => setShowMessages(true)}
          >
            <span className="font-semibold text-[22px]">Messages</span>
          </div>
          <BottomDrawerWrapper
            isDrawerOpen={showMessages}
            setIsDrawerOpen={setShowMessages}
            showClose={false}
          >
            <div className="w-full" onClick={() => setShowMessages(false)}>
              <span className="font-semibold text-[22px]">Hello</span>
            </div>
          </BottomDrawerWrapper> */}
        </div>
      )}
    </>
  )
}

export default MainLayout
