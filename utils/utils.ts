import { Web3Storage } from "web3.storage";
import { DIVE_CONTRACT_ADDRESS_MUMBAI } from "./config";
import { storage } from "./firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

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

// string to string of give length
export const stringToLength = (str:string, length:number):string => {
  return str.slice(0,length) + (str.length > length ? "..." : "");
}

export const uploadFileToFirebaseAndGetUrl = async (file:File,address:string): Promise<string> => {
  let type = file.type.split("/")[0];
  if(!type) {
    type = "other";
  };
  const storageRef = ref(storage, `${type}/${address}/${file.name}`);

  const uploadedToUrl = await uploadBytes(storageRef, file).then(async(snapshot) => {
    console.log('Uploaded a blob or file!');
    //return file url
    const url = await getDownloadURL(snapshot.ref).then((url) => {
      console.log('File available at', url);
      return url;
    })
    return url;
  });
  return uploadedToUrl;
}