import Nav from '../components/Home/Nav';
import '../styles/globals.css'
import {WalletProvider} from "../utils/WalletContext";


function MyApp({ Component, pageProps }) {
  return(
    <WalletProvider>
            <Nav />
       <Component {...pageProps} />
    </WalletProvider>
  )
}

export default MyApp
