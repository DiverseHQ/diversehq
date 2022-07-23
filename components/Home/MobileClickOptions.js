import { useRouter } from 'next/router'
import React from 'react'
import { useProfile } from '../Common/WalletContext'
import { useTheme } from 'next-themes'
const MobileClickOptions = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { theme, setTheme } = useTheme()
  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
    }
  }
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  return (
    <div className='fixed top-14 left-2.5 z-10'>
        <div className='px-3 py-2 bg-p-bg rounded-full my-2 button-dropshadow' onClick={routeToUserProfile}>Visit Profile</div>
        <div className='px-3 py-2 bg-p-bg rounded-full my-2 button-dropshadow' onClick={toggleTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
        <div className='px-3 py-2 bg-p-bg rounded-full my-2 button-dropshadow'>Edit Profile</div>
        <div className='px-3 py-2 bg-p-bg rounded-full my-2 button-dropshadow'>Create Community</div>
        <div className='px-3 py-2 bg-p-bg rounded-full my-2 button-dropshadow'>Disconnect</div>
    </div>
  )
}

export default MobileClickOptions
