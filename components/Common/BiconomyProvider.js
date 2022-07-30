import React, { useState, createContext, useEffect, useContext } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import {toBuffer} from "ethereumjs-util";
import {ethers} from "ethers"
import abi from 'ethereumjs-abi'
import DiveToken from "../../utils/DiveToken.json";

let config = {
  contract: {
      address: "0x5d781fA0fB8241B5fA998B89bD9175a95625DB72",
      abi: DiveToken,
  },
  apiKey: {
      test: "g5GSvGp0O.5beb05f5-40f6-422a-ad77-e264632cf8e8",
      prod: "g5GSvGp0O.5beb05f5-40f6-422a-ad77-e264632cf8e8"
  },
  api: {
      test: "https://test-api.biconomy.io",
      prod: "https://api.biconomy.io"
  }
}



export const BiconomyContext = createContext()


export const BiconomyProvider = ({children}) => {
  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [biconomy,setBiconomy] = useState(null);
  

  useEffect(() => {
    async function init() {
          setLoadingMessage("Initializing Biconomy ...");
          // We're creating biconomy provider linked to your network of choice where your contract is deployed
          
          /*
            This provider is linked to your wallet.
            If needed, substitute your wallet solution in place of window.ethereum 
          */

          ethersProvider = new ethers.providers.Web3Provider(biconomy);


          biconomy.onEvent(biconomy.READY, async () => {

              // Initialize your dapp here like getting user accounts etc
              contract = new ethers.Contract(
                  config.contract.address,
                  config.contract.abi,
                  biconomy.getSignerByAddress(address)
              );

              contractInterface = new ethers.utils.Interface(config.contract.abi);
              getQuoteFromNetwork();
          }).onEvent(biconomy.ERROR, (error, message) => {
              // Handle error while initializing mexa
              console.log(message);
              console.log(error);
          });
      } 
      
  if (address && signer && provider && biconomy) init()
  },[address, signer, provider, biconomy])

  return (
   <BiconomyContext.Provider value={setBiconomy}>
    {children}
   </BiconomyContext.Provider>
  )
}


export const useBiconomy = () => useContext(BiconomyContext)