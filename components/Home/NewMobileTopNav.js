import React, { useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import MobileNavSidebar from './MobileNavSidebar'
import { useAccount, useSigner } from 'wagmi'

const NewMobileTopNav = () => {
  const { user, fetchWeb3Token } = useProfile()
  const { address } = useAccount()
  // const { data: signer } = useSigner()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const { openConnectModal } = useConnectModal()
  const { data: signer } = useSigner()

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
          {(!address || !signer) && (
            <button
              className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-p-btn px-4 py-1"
              onClick={openConnectModal}
            >
              Connect Wallet
            </button>
          )}
          {!user && address && signer && (
            <button
              className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-p-btn px-4 py-1"
              onClick={() => {
                fetchWeb3Token()
              }}
            >
              Sign In
            </button>
          )}
          {user && (
            <img
              src={user?.profileImageUrl}
              onClick={() => setIsOpenSidebar(true)}
              className="w-[35px] h-[35px] rounded-full"
            />
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
