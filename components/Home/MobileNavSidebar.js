import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { IoIosClose } from 'react-icons/io'
import { IoIosHelpCircleOutline } from 'react-icons/io'
import { BsMoon } from 'react-icons/bs'
import { AiOutlineGift } from 'react-icons/ai'
import { MdOutlineGroups, MdOutlinePerson } from 'react-icons/md'
import CreateCommunity from './CreateCommunity'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import LensLoginButton from '../Common/LensLoginButton'
import { stringToLength } from '../../utils/utils'
import { FaRegCopy } from 'react-icons/fa'

const MobileNavSidebar = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const router = useRouter()
  const { user, address } = useProfile()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    showModal({
      component: <CreateCommunity />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const routeToProfile = () => {
    if (!address) {
      notifyInfo('You might want to login first')
      return
    }
    router.push(`/u/${address}`)
  }

  const handleWalletAddressCopy = () => {
    if (!user?.walletAddress) {
      notifyInfo('Please Login')
      return
    }
    navigator.clipboard.writeText(user?.walletAddress)
    notifyInfo('Copied to clipboard')
  }

  return (
    <div
      className={`text-black z-0 fixed top-0 left-0 right-0 bottom-0 w-full overflow-hidden ${
        isOpenSidebar ? 'z-20' : ''
      }`}
    >
      {/* backdrop */}
      {isOpenSidebar && (
        <div
          className="absolute bg-black/20 top-0 right-0 left-0 bottom-0 w-full"
          onClick={() => {
            setIsOpenSidebar(false)
          }}
        />
      )}

      <div
        className={` flex flex-col absolute transition ease-in-out w-[80%] h-full duration-3000 bg-p-bg border gap-4 ${
          isOpenSidebar ? 'top-0 ' : 'top-[-490px]'
        } `}
      >
        <div className="flex flex-row justify-between p-4 gap-2">
          {user && address && (
            <div className="flex flex-col gap-1">
              <img
                src={user?.profileImageUrl}
                className="w-[55px] h-[55px] bg-[#333] rounded-full"
              />
              {user?.name && (
                <h3 className="font-semibold text-[18px]">{user.name}</h3>
              )}
              <div
                className="text-sm flex flex-row items-center cursor-pointer"
                onClick={handleWalletAddressCopy}
              >
                <div className="">{stringToLength(user.walletAddress, 8)}</div>
                <FaRegCopy className="w-7 h-7 px-2" />
              </div>
              <span className="text-[14px] text-s-text">
                {user.communities.length} Communities joined
              </span>
            </div>
          )}
          {!user && !address && <ConnectButton accountStatus="avatar" />}
          <div className="jutify-end">
            <button onClick={() => setIsOpenSidebar(!isOpenSidebar)}>
              <IoIosClose className="w-[40px] h-[40px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col px-4 bg-p-bg">
          <LensLoginButton />

          <button
            className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold py-4 gap-2"
            onClick={() => {
              routeToProfile()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlinePerson className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Profile</span>
          </button>
          <button className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold py-4 gap-2">
            <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Your Communities</span>
          </button>
          <button
            className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold py-4 gap-2"
            onClick={() => {
              createCommunity()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text">Create Community</span>
          </button>
          <button className="flex flex-row items-center hover:bg-p-btn-hover hover:font-semibold py-4 gap-2">
            <AiOutlineGift className="w-[24px] h-[24px] object-contain" />
            <span className="text-p-text">XP Gift</span>
          </button>
        </div>

        <div className="flex flex-col px-4">
          <button className="flex flex-row items-center gap-2 py-4 hover:bg-p-btn-hover hover:font-semibold">
            <BsMoon className="w-[20px] h-[20px]" />
            <span className="text-p-text">Dark Mode</span>
          </button>
          <button className="flex flex-row items-center gap-2 py-4 hover:bg-p-btn-hover hover:font-semibold">
            <IoIosHelpCircleOutline className="w-[20px] h-[20px]" />
            <span className="text-p-text">Help Center</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileNavSidebar
