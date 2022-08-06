import { DIVE_CONTRACT_ADDRESS_MUMBAI } from "./config";

export const addToken = async() =>{
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