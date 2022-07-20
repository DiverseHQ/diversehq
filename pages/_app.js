import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
import MobileTopNav from '../components/Home/MobileTopNav'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../utils/MasterWrapper'
import useDevice from '../utils/useDevice'

function MyApp ({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <MasterWrapper>
      {isDesktop && <Nav />}
      {!isDesktop && <MobileTopNav />}
      <div className='pt-11'>
        <Component {...pageProps} />
      </div>
        {!isDesktop && <MobileBottomNav />}
    </MasterWrapper>
  )
}

export default MyApp
