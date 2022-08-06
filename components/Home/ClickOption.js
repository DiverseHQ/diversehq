import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
import { useAccount, useSigner } from 'wagmi'
import  ABI  from '../../utils/DiveToken.json'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import CreateCommunity from './CreateCommunity'
import { ethers } from 'ethers'
import { useNotify } from '../Common/NotifyContext'
import { DIVE_CONTRACT_ADDRESS_MUMBAI } from '../../utils/config'

const claimAmount = 10;

const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { theme, setTheme } = useTheme()
  const { address } = useAccount()
  const { showModal } = usePopUpModal();
  const [diveContract,setDiveContract] = useState(null)
  const { data: signer } = useSigner();
  const { notifyError, notifySuccess } = useNotify()


  useEffect(() => {
    if(signer){
      const contract = new ethers.Contract(DIVE_CONTRACT_ADDRESS_MUMBAI, ABI, signer)
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
     const res = await diveContract.claimTokens(DIVE_CONTRACT_ADDRESS_MUMBAI,ethers.utils.parseEther(claimAmount.toString()),
     {gasLimit: 3000000, gasPrice: 30000000000 });
     const receipt = await res.wait();
     if (receipt.status === 1) {
       console.log("Tokens claimed: https://rinkeby.etherscan.io/tx/"+res.hash);
       notifySuccess('Tokens Claimed Successfully')
     }
     else {
        notifyError('Tokens Claim Failed')
     }

  }

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    showModal( 
      {
        component: <CreateCommunity />,
        type: modalType.fullscreen,
        onAction: () => {},
        extraaInfo: {}
      }
    )
  }


  return (
    <div className='cursor-pointer'>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={routeToUserProfile}>View Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={createCommunity}>Create Community</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={claimTokens}>Claim {claimAmount} Tokens</div>
    </div>
  )
}

export default ClickOption