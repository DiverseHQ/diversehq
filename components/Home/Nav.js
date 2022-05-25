import {useState, useContext, useEffect} from "react"
import {useProfile} from "../../utils/WalletContext";
import DiveToken from "../../utils/DiveTokens.json"
import {ethers} from "ethers";
import CreatePostPopup from "./CreatePostPopup"
import CreateCommunity from "./CreateCommunity"
import ChangeMonkey from "./ChangeMonkey.js"
import Router from "next/router";

const Nav = () => {
    const {connectWallet,disconnectWallet,user, connecting} = useProfile();
    const [tokens, setTokens] = useState('0');
    const [showOptions, setShowOptions] = useState(false);

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
    <>
    <div className="fixed w-full h-14 flex flex-row justify-between bg-[#1A1A1B] text-white p-2 items-center">
      <div>
        <h3 className="text-2xl " onClick={() => {
          Router.push('/')
        }}>Diversehq</h3>
      </div>
      <div className="flex flex-row">
        <div className="pr-4">
        <CreatePostPopup/>
        </div> 
        <div className="flex flex-row" > 
          <img src={(user && user.profileImageUrl) ? user.profileImageUrl : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"} alt="profile" className="rounded-full h-12 w-12 mr-2" />
          <div className="flex flex-col">
            {!user ? (
              <button className="" onClick={connectWallet}>
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ):(
              <button className="">
                {user.walletAddress.slice(0,6)}...
                </button>
            )   
            }
            <h3><span className="text-purple-800">$DIVE:</span> {tokens} </h3>
          </div>
          {user &&   
          <button className="flex flex-col" onClick={() => {
            setShowOptions(!showOptions);
          }}>
            <img src="/downArrow.png" className="w-[30px]"/>
            </button>
              }
        </div>
      </div>
      
    </div>
    {(showOptions && user) && <div className="fixed top-[66px] right-[5px] flex flex-col">
      <ChangeMonkey />
      <CreateCommunity />
      <div className="pr-4 ">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200" onClick={disconnectWallet} disabled={loading} >
        {loading ? 'Disconnecting...':'Disconnect'}
        </button>
      </div>
      </div>}
    </>
  )
}

export default Nav