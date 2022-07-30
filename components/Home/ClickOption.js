import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
import { useAccount } from 'wagmi'
import DiveToken from '../../utils/DiveToken.json'
import { useContractWrite } from 'wagmi'
import { DIVE_CONTRACT_ADDRESS_RINKEBY } from '../../utils/commonUtils'
// import { sendTransaction } from '../Common/Biconomy'
import  ABI  from '../../utils/DiveToken.json'


const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { theme, setTheme } = useTheme()
  const { address } = useAccount()
  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
    }
  }
  console.log("address",address);
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const diveContract = useContractWrite({
    addressOrName: DIVE_CONTRACT_ADDRESS_RINKEBY,
    contractInterface: ABI,
    functionName: 'claimtokens',
    args: [DIVE_CONTRACT_ADDRESS_RINKEBY, 200000000000000],
  })

  const claimTokens = async () => {
     await diveContract.write();
  }

  return (
    <div className='cursor-pointer'>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={routeToUserProfile}>Visit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={claimTokens} >Claim Tokens</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '>Edit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '>Create Community</div>
    </div>
  )
}

export default ClickOption