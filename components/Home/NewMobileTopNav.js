import React, { useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import MobileNavSidebar from './MobileNavSidebar'
import ConnectWalletAndSignInButton from '../Common/ConnectWalletAndSignInButton'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'
import { BiArrowBack } from 'react-icons/bi'

const NewMobileTopNav = () => {
  const { user } = useProfile()
  // const { data: signer } = useSigner()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const router = useRouter()

  let prevScrollpos = null

  if (typeof window !== 'undefined') {
    prevScrollpos = window.pageYOffset
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

  return (
    <>
      <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] backdrop-blur-lg bg-white/50">
        {router.pathname.startsWith('/p/') ||
        router.pathname.startsWith('/c/') ||
        router.pathname.startsWith('/u/') ? (
          <div className="h-[32px] flex flex-row items-center gap-2 text-[18px]">
            <div className="flex items-center justify-center w-8 h-8 hover:bg-p-btn-hover rounded-full">
              <BiArrowBack
                onClick={() => router.back()}
                className="w-6 h-6 rounded-full cursor-pointer"
              />
            </div>
            <span className="font-semibold">
              {router.pathname.startsWith('/p/') && 'Post'}
              {router.pathname.startsWith('/c/') && 'Community'}
              {router.pathname.startsWith('/u/') && 'Profile'}
            </span>
          </div>
        ) : (
          <>
            <div>
              {!user && (
                <ConnectWalletAndSignInButton
                  connectWalletLabel="Connect"
                  SignInLabel="Sign In"
                />
              )}
              {user && (
                <ImageWithPulsingLoader
                  src={user?.profileImageUrl}
                  onClick={() => setIsOpenSidebar(true)}
                  className="w-[35px] h-[35px] rounded-full"
                  loaderClassName={'w-[35px] h-[35px] rounded-full'}
                />
              )}
            </div>
            <div>
              <span
                className={`font-semibold text-[18px] ${
                  !user ? '-ml-[40px]' : ''
                }`}
              >
                {router.pathname === '/' && 'Home'}
                {router.pathname.startsWith('/explore') && 'Explore'}
                {router.pathname.startsWith('/notification') && 'Notifications'}
                {router.pathname.startsWith('/search') && 'Search'}
              </span>
            </div>
            <div>
              <img
                src="/LogoV3TrimmedWithBG.png"
                alt="DiverseHQ logo"
                className="w-[32px] h-[32px]"
              />
            </div>
          </>
        )}
        {/* <div>
          <AiOutlineCompass className="text-[22px]" />
        </div> */}
      </div>
      {isOpenSidebar && (
        <MobileNavSidebar
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      )}
    </>
  )
}

export default NewMobileTopNav
