import React from 'react'

const AddToken = () => {
    const addToken = async() =>{
        try {
           const wasAdded = await ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20', 
                options: {
                  address: '0x5F232e9A0E12D117180b27a165082Ea8ac086a69', 
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
  return (
    <div>
        <button className="text-2xl font=semibold text-white border rounded-full border-white" type="button" onClick={addToken}>Add $DIVE</button>
    </div>
  )
}

export default AddToken