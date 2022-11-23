import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
import MobileTopNav from '../components/Home/MobileTopNav'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import useDevice from '../components/Common/useDevice'
import RightPart from '../components/Common/RightPart'

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <MasterWrapper>
      <div className="text-p-text bg-p-bg min-h-screen">
        {isDesktop && (
          <div>
            <Nav />
            <div className="max-w-[600px] ml-[400px] overflow-y-auto no-scrollbar h-full">
              <Component {...pageProps} />
            </div>
            <RightPart />
          </div>
        )}

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
    </MasterWrapper>
  )
}

export default MyApp
