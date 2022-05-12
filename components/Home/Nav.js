import {useState, useContext, useEffect} from "react"
import {WalletContext} from "../../utils/WalletContext";
import DiveToken from "../../utils/DiveTokens.json"
import {ethers} from "ethers";
import CreatePostPopup from "./CreatePostPopup"
import CreateCommunity from "./CreateCommunity"
import ChangeMonkey from "./ChangeMonkey.js"

const Nav = () => {
    const {connectWallet,disconnectWallet,user} = useContext(WalletContext);
    const [tokens, setTokens] = useState('0');

    const CONTRACT_ADDRESS = "0x804Be198792A232E9f4b2a9A891CE1B453343854"

    const getDiveTokens = async () => {
        if(user){
            console.log("Connect to MetaMask first!");
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, DiveToken.abi, provider);
        const tokens = (await contract.getBalance(user.walletAddress)).toString();
        console.log(tokens);
        setTokens(tokens);
    }

      useEffect(() =>{
        if(user){
          getDiveTokens();
        }
      },[])
  return (
    <div className="flex flex-row justify-between bg-[#1A1A1B] text-white p-2 items-center">
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
        <div><ChangeMonkey /></div>
        <div className="flex flex-row" > 
          <img src={(user && user.profileImageUrl) ? user.profileImageUrl : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"} alt="profile" className="rounded-full h-12 w-12 mr-2" />
          <div className="flex flex-col">
            {!user ? (
              <button className="" onClick={connectWallet}>
                Connect Wallet
              </button>
            ):(
              <button className="" onClick={disconnectWallet}>
                {user.walletAddress.slice(0,6)}...
                </button>
            )   
            }
            <h3><span className="text-purple-800">$DIVE:</span> {tokens} </h3>
          </div>  
        </div>
      </div>
      
    </div>
  )
}

export default Nav