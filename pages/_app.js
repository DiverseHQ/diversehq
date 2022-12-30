import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
import MobileTopNav from '../components/Home/MobileTopNav'
// eslint-disable-next-line no-unused-vars
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import useDevice from '../components/Common/useDevice'
// eslint-disable-next-line no-unused-vars
import RightPart from '../components/Common/RightPart'
import Navbar from '../components/Home/Navbar'
import LeftSidebar from '../components/Home/LeftSidebar'
import RightSidebar from '../components/Home/RightSidebar'

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <MasterWrapper>
        {!isDesktop && (
          <div className="text-p-text bg-p-bg min-h-screen">
            {/* {isDesktop && (
            <div>
              <Nav />
              <div className="w-[600px] ml-[calc((100vw-600px)/2)] overflow-y-auto no-scrollbar h-full">
                <Component {...pageProps} />
              </div>
              <RightPart />
            </div>
          )} */}

            {!isDesktop && (
              <>
                <MobileTopNav />
                <div className={'pt-16 pb-16'}>
                  <Component {...pageProps} />
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
              <LeftSidebar />
              <div className="flex-1 px-4 md:px-8 min-h-screen">
                <Component {...pageProps} />
              </div>
              <RightSidebar />
            </div>
          </div>
        )}
      </MasterWrapper>
    </>
  )
}

export default MyApp
