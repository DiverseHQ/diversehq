import { useRouter } from 'next/router';
import React from 'react'
import { useProfile } from '../../utils/WalletContext'

const MobileClickOptions = () => {
  const router = useRouter();
  const { user } = useProfile();
  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
    }
  }
  return (
    <div className='fixed top-14 left-2.5 z-10'>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow' onClick={routeToUserProfile}>Visit Profile</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow'>Edit Profile</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow'>Create Community</div>
        <div className='px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow'>Disconnect</div>
    </div>
  )
}

export default MobileClickOptions