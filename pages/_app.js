import React, { memo, useEffect, useState } from 'react'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import MainLayout from '../components/Home/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
// import Loader from '../components/Loader'
import { useRef } from 'react'
// import { useRouter } from 'next/router'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { sortTypes } from '../utils/config'
TimeAgo.addDefaultLocale(en)

const ROUTES_TO_RETAIN = [
  '/',
  `/?sort=${sortTypes.LATEST}`,
  `/?sort=${sortTypes.TOP_TODAY}`,
  `/?sort=${sortTypes.TOP_WEEK}`,
  `/?sort=${sortTypes.TOP_MONTH}`,
  '/feed/all',
  `/feed/all?sort=${sortTypes.LATEST}`,
  `/feed/all?sort=${sortTypes.TOP_TODAY}`,
  `/feed/all?sort=${sortTypes.TOP_WEEK}`,
  `/feed/all?sort=${sortTypes.TOP_MONTH}`,
  `/feed/foryou`,
  `/feed/foryou?sort=${sortTypes.LATEST}`,
  `/feed/foryou?sort=${sortTypes.TOP_TODAY}`,
  `/feed/foryou?sort=${sortTypes.TOP_WEEK}`,
  `/feed/foryou?sort=${sortTypes.TOP_MONTH}`,
  `/feed/offchain`
]

function MyApp({ Component, pageProps, isMobileView }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const retainedComponents = useRef({})
  const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.asPath)

  // Add Component to retainedComponents if we haven't got it already
  if (isRetainableRoute && !retainedComponents.current[router.asPath]) {
    const MemoComponent = memo(Component)
    retainedComponents.current[router.asPath] = {
      component: <MemoComponent {...pageProps} />,
      scrollPos: 0
    }
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = () => {
    setIsLoading(true)
    if (isRetainableRoute) {
      retainedComponents.current[router.asPath].scrollPos = window.scrollY
    }
  }

  // code for loading on route change
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', () => {
      setIsLoading(false)
    })
    router.events.on('routeChangeError', () => {
      setIsLoading(false)
    })
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.asPath])

  // Scroll to the saved position when we load a retained component
  useEffect(() => {
    if (isRetainableRoute && !isLoading) {
      window.scrollTo(0, retainedComponents.current[router.asPath].scrollPos)
    }
  }, [Component, pageProps, isLoading])

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
        <meta name="twitter:creator" content="@useDiverseHQ" />
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
      <script
        defer
        data-domain="app.diversehq.xyz,lensverse.web"
        src="https://plausible.io/js/script.js"
      ></script>
      <Script
        defer
        data-domain="app.diversehq.xyz,lensverse.web"
        src="https://plausible.io/js/script.js"
      ></Script>
      <DefaultSeo
        title="DiverseHQ"
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https://app.diversehq.xyz',
          siteName: 'DiverseHQ'
        }}
        twitter={{
          handle: '@useDiverseHQ',
          cardType: 'summary_large_image'
        }}
      />
      <MasterWrapper>
        <MainLayout isLoading={isLoading} isMobileView={isMobileView}>
          <>
            <div>
              {Object.entries(retainedComponents.current).map(([path, c]) => {
                return (
                  <div
                    key={path}
                    style={{
                      display: router.asPath === path ? 'block' : 'none'
                    }}
                  >
                    {c.component}
                  </div>
                )
              })}
            </div>

            {!isRetainableRoute && <Component {...pageProps} />}
          </>
        </MainLayout>
      </MasterWrapper>
    </>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  // check is isMobile
  let isMobileView = (
    ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
  //Returning the isMobileView as a prop to the component for further use.
  return {
    isMobileView: Boolean(isMobileView)
  }
}

export default MyApp
