import { Web3Storage } from "web3.storage";
import { DIVE_CONTRACT_ADDRESS_MUMBAI } from "./config";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const addToken = async():Promise<void> =>{
    try {
       const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', 
            options: {
              address: DIVE_CONTRACT_ADDRESS_MUMBAI, 
              symbol: 'DIVE', 
              decimals: 18, 
              image: 'https://bafybeigy2nfjeuzzwrieti5m4uhslzenezzxp5eueepj7mqs2rqx24by7a.ipfs.dweb.link/name.png', 
            },
          },
        });
      
        if (wasAdded) {
          console.log('Lets $DIVE it Together');
        } else {
          console.log('$DIVE Coin has not been added');
        }
      } catch (error) {
        console.log(error);
      }
}

export const uploadFileToIpfs = async (file:File): Promise<string> => {
  const token:string = String(process.env.NEXT_PUBLIC_WEB_STORAGE);
  const newFile:File = new File([file],file.name.replace(/\s/g, "_"),{type: file.type});
  const storage = new Web3Storage({ token });
  const cid = await storage.put([newFile]);
  return `https://dweb.link/ipfs/${cid}/${newFile.name}`;
}