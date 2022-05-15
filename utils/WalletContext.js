import {useState, createContext, useEffect} from "react";
import Web3 from "web3";
import Web3Token from "web3-token";
import apiEndpoint from "../components/Home/ApiEndpoint";
export const WalletContext = createContext([]);

let once = true;

export const WalletProvider = ({children}) => {
    const [wallet, setWallet] = useState(null);
    const [token, setToken] = useState(null);
    const [web3,setWeb3] = useState(null);
    const [connecting,setConnecting] = useState(false);
    const [user,setUser] = useState(null);
    useEffect(() => {
      if(wallet && once){
        once=false;
        refetchToken();
      }
    },[wallet])

    useEffect(() => {
      ;(async() => {
        await connectWallet()
      })();
    },[])


    const getUserInfo= async () => {
      try{
        const userInfo = await fetch(`${apiEndpoint}/user/${wallet}`)
          .then(res => res.json());
        console.log(userInfo);
        setUser(userInfo);
      }catch(error){
        console.log(error);
      }
    }
    const refetchToken = async () => {
      let existingToken = null;
      let verified = false;
      try{
        existingToken = localStorage.getItem("token");
        console.log(existingToken);
        if(existingToken){
          setToken(existingToken);
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
        const signedToken = await Web3Token.sign(msg => web3.eth.personal.sign(msg, wallet), '5d');
        console.log(signedToken);
        setToken(signedToken);
        try{
          await fetch(`${apiEndpoint}/user`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": signedToken
            }
          }).then(r => r.json()).then(res => {
            console.log(res);
          })
        }catch(error){
          console.log(error);
        }
        localStorage.setItem("token", signedToken);
      }
      await getUserInfo();
      setLoading(false);
    }


    const connectWallet = async () => {
      console.log("connecting wallet");
      setConnecting(true);
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
              once=true;
              localStorage.removeItem("token");
              setWallet(accounts[0]);
            }else{
              once=true;
              setWallet(null);
            }
          });

          // generating a token with 1 day of expiration time
          once=true;
          setWallet(address);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }

      const disconnectWallet = () => {
        once=true;
        setWallet(null);
        setUser(null);
      }
    return(
        <WalletContext.Provider value={{connectWallet, disconnectWallet,getUserInfo,token, connecting,user}}>
            {children}
        </WalletContext.Provider>
    )
}