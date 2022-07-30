export const POST_LIMIT = 2;
export const COMMUNITY_LIMIT = 3;
export const DIVE_CONTRACT_ADDRESS_RINKEBY = "0x6185df8fa5A8Daac99dE8Db028EB1739eab6ca4A"
export const addToken = async() =>{
    try {
       const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', 
            options: {
              address: DIVE_CONTRACT_ADDRESS_RINKEBY, 
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