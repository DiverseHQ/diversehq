import React, { useEffect, useState } from 'react'
import MobileBottomNav from '../components/Home/MobileBottomNav'
// import MobileTopNav from '../components/Home/MobileTopNav'
// eslint-disable-next-line no-unused-vars
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import useDevice from '../components/Common/useDevice'
import Navbar from '../components/Home/Navbar'
import LeftSidebar from '../components/Home/LeftSidebar'
import RightSidebar from '../components/Home/RightSidebar'

import NewMobileTopNav from '../components/Home/NewMobileTopNav'
import Script from 'next/script'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useDevice()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <>
      <Head>
        <title>DiverseHQ</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
      />
      <Script id="google-analytics-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
      </Script>
      <MasterWrapper>
        {!isDesktop && (
          <div className="text-p-text bg-p-bg min-h-screen">
            {!isDesktop && (
              <>
                <NewMobileTopNav />
                {/* <MobileTopNav /> */}
                <div className={'pb-16'}>
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
              <div className="flex-1 min-h-screen">
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
