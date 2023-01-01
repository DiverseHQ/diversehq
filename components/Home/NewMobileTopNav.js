import React, { useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import MobileNavSidebar from './MobileNavSidebar'
import { GiHamburgerMenu } from 'react-icons/gi'

const NewMobileTopNav = () => {
  const { user, address } = useProfile()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <div className="flex flex-row justify-between px-2 py-1 items-center shadow-nav">
        <div>
          {!user && !address ? (
            <button
              className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-p-btn px-4 py-1"
              onClick={openConnectModal}
            >
              Connect Wallet
            </button>
          ) : (
            <GiHamburgerMenu
              onClick={() => setIsOpenSidebar((prev) => !prev)}
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
