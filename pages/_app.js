import { ThemeProvider } from 'next-themes'
import React, { useEffect, useState } from 'react'
import Nav from '../components/Home/Nav'
import '../styles/globals.css'
import { NotifyProvider } from '../utils/NotifyContext'
import { WalletProvider } from '../utils/WalletContext'

function MyApp ({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <WalletProvider>
      <NotifyProvider>
      <ThemeProvider defaultTheme = 'system'>
            <Nav />
            <div className="h-screen pt-16 bg-primary-bg text-white">
        <Component {...pageProps} />
       </div>
       </ThemeProvider>
       </NotifyProvider>
    </WalletProvider>
  )
}

export default MyApp
