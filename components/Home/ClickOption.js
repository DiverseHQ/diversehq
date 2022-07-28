import React from 'react'
import AddToken from './AddToken'
import ChangeMonkey from './ChangeMonkey'
import CreateCommunity from './CreateCommunity'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
import { useAccount } from 'wagmi'

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
  return (
    <div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow' onClick={routeToUserProfile}>Visit Profile</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow'>Edit Profile</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow'>Create Community</div>
    </div>
  )
}

export default ClickOption