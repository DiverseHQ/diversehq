import React, { useEffect, useState } from 'react'
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
        <Component {...pageProps} />
    </MasterWrapper>
  )
}

export default MyApp
