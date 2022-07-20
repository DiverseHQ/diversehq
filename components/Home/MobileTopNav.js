import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useProfile } from '../../utils/WalletContext'
import MobileClickOptions from './MobileClickOptions'

const MobileTopNav = () => {
  const [showOptions, setShowOptions] = useState(false)
  const router = useRouter()
  const { user } = useProfile()
  let prevScrollpos = window.pageYOffset
  if (window) {
    window.onscroll = function () {
      const currentScrollPos = window.pageYOffset
      if (prevScrollpos > currentScrollPos) {
        document.getElementById('mobile-top-navbar').style.top = '0'
      } else {
        document.getElementById('mobile-top-navbar').style.top = '-100px'
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
    <div id='mobile-top-navbar' className='mobile-top-nav bg-p-bg border-b border-s-bg flex flex-row items-center py-2.5 px-4 z-10'>
       {user && user.profileImageUrl && <Image src={user.profileImageUrl} width={30} height={30} className="rounded-full" onClick={handleOptionsClick} />}
       {(!user || !user.profileImageUrl) && <Image src="/person.png" width={30} height={30} className="rounded-full" onClick={handleOptionsClick} />}
       <div className='pl-5 text-base font-bold tracking-wider' onClick={routeToHome}>Home</div>
    </div>
    {showOptions && <MobileClickOptions />}
    </>
  )
}

export default MobileTopNav
