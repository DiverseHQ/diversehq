import {useState, createContext, useEffect} from "react";
import Web3 from "web3";
import Web3Token from "web3-token";
export const WalletContext = createContext([]);

export const WalletProvider = ({children}) => {
    const [wallet, setWallet] = useState(null);
    const [token, setToken] = useState(null);
    const [web3,setWeb3] = useState(null);
    useEffect(() => {
      if(wallet){
        refetchToken();
      }
    },[wallet])
    const refetchToken = async () => {
      let existingToken = null;
      let verified = false;
      try{
        existingToken = localStorage.getItem("token");
        console.log(existingToken);
        if(existingToken){
          const { address, body } = await Web3Token.verify(existingToken);
          console.log(address, body);
          verified = true;
        }
      }catch(error){
        console.log(error);
      }
      if(!existingToken || !verified){
        if(!web3){
          await connectWallet();
        }
        const token = await Web3Token.sign(msg => web3.eth.personal.sign(msg, wallet), '5d');
        console.log(token);
        localStorage.setItem("token", token);
      }
    }
    const connectWallet = async () => {
        try {
          const { ethereum } = window;
      
          if (!ethereum) {
            alert("Get MetaMask!");
            return;
          }
          const newWeb3 = new Web3(ethereum);
          setWeb3(newWeb3);
          await ethereum.request({ method: 'eth_requestAccounts'});

          // getting address from which we will sign message
          const address = (await newWeb3.eth.getAccounts())[0];

          window.ethereum.on("accountsChanged", function (accounts) {
            if(accounts.length > 0){
              localStorage.removeItem("token");
            setWallet(accounts[0]);
            }else{
              setWallet(null);
            }
          });

          // generating a token with 1 day of expiration time
          setWallet(address);
        } catch (error) {
          console.log(error);
        }
      }

      const disconnectWallet = () => {
        setWallet(null);
      }
    return(
        <WalletContext.Provider value={{wallet, connectWallet, disconnectWallet,token}}>
            {children}
        </WalletContext.Provider>
    )
}