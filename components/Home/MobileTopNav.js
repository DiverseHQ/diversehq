import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import MobileClickOptions from './MobileClickOptions'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const MobileTopNav = () => {
  const [showOptions, setShowOptions] = useState(false)
  const router = useRouter()
  const { user } = useProfile()
  let prevScrollpos = window.pageYOffset

  if (window) {
    window.onscroll = function () {
      const mobileTopNavEl = document.getElementById('mobile-top-navbar')
      if (!mobileTopNavEl) return
      const currentScrollPos = window.pageYOffset
      if (prevScrollpos > currentScrollPos) {
        mobileTopNavEl.style.top = '0'
      } else {
        mobileTopNavEl.style.top = '-100px'
      }
      prevScrollpos = currentScrollPos
    }
  }
  const routeToHome = () => {
    router.push('/')
  }

  const handleOptionsClick = () => {
    setShowOptions(!showOptions)
  }
  return (
    <>
    <div id='mobile-top-navbar' className='mobile-top-nav bg-p-bg border-b border-p-border flex flex-row items-center justify-between py-2.5 px-4 z-10'>
      <div className='flex flex-row items-center'>
       {user && user.profileImageUrl && <Image src={user.profileImageUrl} width={30} height={30} className="rounded-full" onClick={handleOptionsClick} />}
       {(!user || !user.profileImageUrl) && <Image src="/person.png" width={30} height={30} className="rounded-full" onClick={handleOptionsClick} />}
       <div className='pl-5 text-base font-bold tracking-wider' onClick={routeToHome}>Home</div>
       </div>
       <ConnectButton accountStatus="avatar" />
    </div>
    {showOptions && <MobileClickOptions />}
    </>
  )
}

export default MobileTopNav
