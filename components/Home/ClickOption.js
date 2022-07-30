import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
import { useAccount, useContractWrite, useSigner } from 'wagmi'
import DiveToken from '../../utils/DiveToken.json'
import { DIVE_CONTRACT_ADDRESS_RINKEBY, addToken } from '../../utils/commonUtils'
// import { sendTransaction } from '../Common/Biconomy'
import  ABI  from '../../utils/DiveToken.json'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import CreateCommunity from './CreateCommunity'
import { ethers } from 'ethers'

const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { theme, setTheme } = useTheme()
  const { address } = useAccount()
  const { showModal, hideModal } = usePopUpModal();
  const [diveContract,setDiveContract] = useState(null)
  const { data: signer } = useSigner();

  useEffect(() => {
    if(signer){
      const contract = new ethers.Contract(DIVE_CONTRACT_ADDRESS_RINKEBY, ABI, signer)
      setDiveContract(contract)
    }
  },[signer])

  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
    }
  }
  console.log("address",address);
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }


  const claimTokens = async () => {
     await diveContract.claimtokens(DIVE_CONTRACT_ADDRESS_RINKEBY,"10000000000000000000",
     {gasLimit: 3000000, gasPrice: 30000000000});
  }

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    showModal( 
      {
        component: <CreateCommunity />,
        type: modalType.normal,
        onAction: () => {},
        extraaInfo: {
          
        }
      }
    )
  }


  return (
    <div className='cursor-pointer'>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={routeToUserProfile}>Visit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={claimTokens} >Claim Tokens</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={addToken} >Add Dive</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '>Edit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={createCommunity}>Create Community</div>
    </div>
  )
}

export default ClickOption