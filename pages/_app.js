import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import Nav from '../components/Home/Nav';
import '../styles/globals.css'
import {WalletProvider} from "../utils/WalletContext";


function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return(
    <WalletProvider>
      <ThemeProvider defaultTheme = 'system'> 
            <Nav />
            <div className="h-screen pt-16 overflow-y-auto bg-primary-bg text-white">
        <Component {...pageProps} />
       </div>
       </ThemeProvider>
    </WalletProvider>
  )
}

export default MyApp
