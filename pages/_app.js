import Nav from '../components/Home/Nav';
import '../styles/globals.css'
import {WalletProvider} from "../utils/WalletContext";


function MyApp({ Component, pageProps }) {
  return(
    <WalletProvider>
            <Nav />
            <div className="h-screen pt-16 overflow-y-auto bg-primary-bg text-white">
        <Component {...pageProps} />
       </div>
    </WalletProvider>
  )
}

export default MyApp
