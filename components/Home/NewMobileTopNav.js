import React, { useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import MobileNavSidebar from './MobileNavSidebar'
import ConnectWalletAndSignInButton from '../Common/ConnectWalletAndSignInButton'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const NewMobileTopNav = () => {
  const { user } = useProfile()
  // const { data: signer } = useSigner()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

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

  return (
    <>
      <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm">
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
            // <img
            //   src={user?.profileImageUrl}
            //   onClick={() => setIsOpenSidebar(true)}
            //   className="w-[35px] h-[35px] rounded-full"
            // />
          )}
        </div>
        <div>
          <img
            src="/logo.svg"
            alt="DiverseHQ logo"
            className="w-[35px] h-[35px]"
          />
        </div>
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
