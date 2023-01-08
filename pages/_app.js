import React from 'react'
// import MobileBottomNav from '../components/Home/MobileBottomNav'
// import MobileTopNav from '../components/Home/MobileTopNav'
// eslint-disable-next-line no-unused-vars
// import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../components/Common/MasterWrapper'
// import useDevice from '../components/Common/useDevice'
// import Navbar from '../components/Home/Navbar'
// import LeftSidebar from '../components/Home/LeftSidebar'
// import RightSidebar from '../components/Home/RightSidebar'

// import NewMobileTopNav from '../components/Home/NewMobileTopNav'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import MainLayout from '../components/Home/MainLayout'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  // const [mounted, setMounted] = useState(false)
  // // const { isDesktop } = useDevice()
  // useEffect(() => setMounted(true), [])
  // if (!mounted) return null
  return (
    <>
      {/* <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://diversehq.xyz/',
          siteName: 'DiverseHQ'
        }}
        twitter={{
          handle: '@useDiverseHQ',
          site: '@useDiverseHQ',
          cardType: 'summary_large_image'
        }}
      /> */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#9378d8" />
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
      {/* <NextSeo
        title="DiverseHQ"
        description="We believe access and content reach is not just for famous few. Join us in our mission to democratize and give this power back to you."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://diversehq.xyz',
          site_name: 'DiverseHQ',
          images: [
            {
              url: 'https://diversehq.xyz/vector-bg.png',
              width: 1200,
              height: 630,
              alt: 'DiverseHQ'
            }
          ]
        }}
        twitter={{
          handle: '@useDiverseHQ',
          cardType: 'summary_large_image'
        }}
      /> */}
      <MasterWrapper>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </MasterWrapper>
    </>
  )
}

export default MyApp
