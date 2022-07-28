import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
import MobileTopNav from '../components/Home/MobileTopNav'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import useDevice from '../components/Common/useDevice'
import { ConnectButton } from '@rainbow-me/rainbowkit';

function MyApp ({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <MasterWrapper>
      <div className="text-p-text bg-p-bg">
      {isDesktop && <div className=''>
        <Nav />
        <div className='max-w-[600px] pt-6 ml-64 overflow-y-auto no-scrollbar h-full'>
        <Component {...pageProps} />
        </div>
        <div className='fixed top-0 right-10 pt-6 h-full overflow-y-auto no-scrollbar'>
          <ConnectButton chainStatus="icon" />
          </div>
        </div>}

      {!isDesktop &&
      <>
        <MobileTopNav />
        <div className={'pt-16 pb-16'}>
          <Component {...pageProps} />
        </div>
        <MobileBottomNav />
       </>}
    </div>
    </MasterWrapper>
  )
}

export default MyApp
