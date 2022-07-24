import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
import MobileTopNav from '../components/Home/MobileTopNav'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import useDevice from '../components/Common/useDevice'

function MyApp ({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <MasterWrapper>
      <div className="text-p-text">
      {!isDesktop && <MobileTopNav />}
      {isDesktop && <Nav />}
      <div className={'pt-11 pb-16'}>
        <Component {...pageProps} />
      </div>
        {!isDesktop && <MobileBottomNav />}
    </div>
    </MasterWrapper>
  )
}

export default MyApp
