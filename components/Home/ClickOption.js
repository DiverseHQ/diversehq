import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
import { useAccount } from 'wagmi'
import DiveToken from '../../utils/DiveToken.json'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
// import { sendTransaction } from '../Common/Biconomy'


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



  // const { config } = usePrepareContractWrite({
  //   addressOrName: '0x9aa49AF0D7Af1c1dd847C5c715931b3546Bfa1F8',
  //   contractInterface: DiveToken.abi,
  //   functionName: 'claimtokens',
  //   functionArguments: ['0x9aa49AF0D7Af1c1dd847C5c715931b3546Bfa1F8', 10 * 10 ** 18],
  //   onSuccess: () => {
  //     console.log('success')
  //   },
  //   onError: () => {
  //     console.log('error')
  //   }

  // })
  // const { data, isLoading, isSuccess, write } = useContractWrite(config)


  return (
    <div className='cursor-pointer'>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow ' onClick={routeToUserProfile}>Visit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '  >Claim Tokens</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '>Edit Profile</div>
      <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow '>Create Community</div>
    </div>
  )
}

export default ClickOption