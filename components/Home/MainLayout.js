import React from 'react'
import useDevice from '../Common/useDevice'
// import LeftSidebar from './LeftSidebar'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import NewMobileTopNav from './NewMobileTopNav'
import RightSidebar from './RightSidebar'
import ScrollToTopButton from '../Common/UI/ScrollToTopButton'
import NewLeftSidebar from './NewLeftSidebar'

const MainLayout = ({ children }) => {
  const { isDesktop } = useDevice()
  return (
    <>
      {!isDesktop && (
        <div className="text-p-text bg-p-bg min-h-screen">
          {!isDesktop && (
            <>
              <NewMobileTopNav />
              {/* <MobileTopNav /> */}
              <div className={'pb-16'}>
                <ScrollToTopButton />
                {children}
              </div>
              <MobileBottomNav />
            </>
          )}
        </div>
      )}
      {isDesktop && (
        <div className="relative min-h-screen bg-p-bg">
          <Navbar />
          <div className="flex flex-row">
            <NewLeftSidebar />
            <div className="relative flex-1 min-h-screen text-p-text">
              <ScrollToTopButton />
              {children}
            </div>
            <RightSidebar />
          </div>
        </div>
      )}
    </>
  )
}

export default MainLayout
