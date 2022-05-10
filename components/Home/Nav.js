import {useState, useContext, useEffect} from "react"
import {WalletContext} from "../../utils/WalletContext";
import DiveToken from "../../utils/DiveTokens.json"
import {ethers} from "ethers";
import CreatePostPopup from "./CreatePostPopup"
import CreateCommunity from "./CreateCommunity"
const Nav = () => {
    const {wallet,connectWallet,disconnectWallet} = useContext(WalletContext);
    const [tokens, setTokens] = useState('0');

    const CONTRACT_ADDRESS = "0x804Be198792A232E9f4b2a9A891CE1B453343854"

    const getDiveTokens = async () => {
        if(!wallet){
            console.log("Connect to MetaMask first!");
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, DiveToken.abi, provider);
        const tokens = (await contract.getBalance(wallet)).toString();
        console.log(tokens);
        setTokens(tokens);

      }

      useEffect(() =>{
        if(wallet){
          getDiveTokens();
        }
      },[wallet])
  return (
    <div className="flex flex-row justify-between">
      <div>
        <h3 className="text-2xl ">Diversehq</h3>
      </div>
      <div className="flex flex-row">
        <div className="pr-4">
        <CreatePostPopup/>
        </div> 
        <div className="pr-4">
        <CreateCommunity/>
        </div>      
        <div className="flex flex-col">
        <div>
        {!wallet ? (
          <button className="" onClick={connectWallet}>
            Connect Wallet
          </button>
        ):(
          <button className="" onClick={disconnectWallet}>
            {wallet.slice(0,6)}...
            </button>
        )   
        }
        </div>
        <div>
        <h3><span className="text-purple-800">$DIVE:</span> {tokens}</h3>
        </div>
        </div>
  
      </div>
      
    </div>
  )
}

export default Nav