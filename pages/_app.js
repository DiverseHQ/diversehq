import React, { useEffect, useState } from 'react'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import MasterWrapper from '../utils/MasterWrapper'

function MyApp ({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <MasterWrapper>
        <Nav />
            <div className="h-screen pt-16 bg-primary-bg text-white">
        <Component {...pageProps} />
       </div>
       </MasterWrapper>
  )
}

export default MyApp
