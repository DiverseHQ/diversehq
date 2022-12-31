import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { usePopUpModal, modalType } from '../Common/CustomPopUpProvider'
import CreateCommunity from './CreateCommunity'
import CreatePostPopup from './CreatePostPopup'
import { useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import ClickOption from './ClickOption'
// import LoginButton from '../Common/UI/LoginButton'
import { stringToLength } from '../../utils/utils'

import { FaRegCopy } from 'react-icons/fa'
import { AiOutlineCompass, AiOutlineGift } from 'react-icons/ai'
import { MdOutlineGroups } from 'react-icons/md'
import {
  IoMdNotificationsOutline,
  IoIosHelpCircleOutline,
  IoIosArrowDown,
  IoIosArrowUp
} from 'react-icons/io'
import { BsMoon } from 'react-icons/bs'

const LeftSidebar = () => {
  const [showMore, setShowMore] = useState(false)

  const router = useRouter()
  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()
  const { openConnectModal } = useConnectModal()

  const routeToExplore = () => {
    router.push('/explore')
  }

  const { notifyInfo } = useNotify()
  const { disconnect } = useDisconnect()

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal({
      component: <ClickOption />,
      type: modalType.customposition,
      onAction: () => {},
      extraaInfo: {
        bottom:
          window.innerHeight -
          e.currentTarget.getBoundingClientRect().top +
          10 +
          'px',
        left: e.currentTarget.getBoundingClientRect().left + 'px'
      }
    })
  }

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    showModal({
      component: <CreateCommunity />,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const handleWalletAddressCopy = () => {
    if (!user?.walletAddress) {
      notifyInfo('Please Login')
      return
    }
    navigator.clipboard.writeText(user?.walletAddress)
    notifyInfo('Copied to clipboard')
  }

  const createPost = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  useEffect(() => {
    console.log('user', user)
    console.log('address', address)
  }, [user, address])

  return (
    <div className="relative flex flex-col items-start border-r-[1px] border-p-btn sticky top-[64px] right-0 h-[calc(100vh-62px)] py-8 px-4 md:px-6 lg:px-10 xl:px-12 w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] justify-between">
      <div className="flex flex-col items-start gap-4 mb-2">
        <button
          className="flex flex-row items-center hover:bg-p-btn-hover px-2 py-2 lg:px-4 rounded-[20px] gap-1 md:gap-2"
          onClick={createCommunity}
        >
          <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          <span className="text-[16px] md:text-[18px] font-semibold text-p-text ">
            Create Community
          </span>
        </button>
        <button className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2">
          <IoMdNotificationsOutline className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            Notifications
          </span>
        </button>
        <button
          className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2"
          onClick={routeToExplore}
        >
          <AiOutlineCompass className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            Explorer
          </span>
        </button>
        <button className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2">
          <AiOutlineGift className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            XP Gift
          </span>
        </button>
      </div>
      <div>
        <button
          className="flex flex-row items-center bg-transparent hover:bg-[#ccc] px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2"
          onClick={() => setShowMore((prev) => !prev)}
        >
          <span className="text-[18px] text-p-text ">More</span>
          {showMore ? (
            <IoIosArrowUp className="w-[24px] h-[24px] object-contain" />
          ) : (
            <IoIosArrowDown className="w-[24px] h-[24px] object-contain" />
          )}
        </button>
        {showMore && (
          <div className="gap-0 ml-4">
            <div className="flex flex-row items-center bg-transparent hover:bg-[#ccc] px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2">
              <BsMoon className="w-[16px] h-[16px] object-contain" />
              <span className="text-[14px] text-p-text ">Dark Mode</span>
            </div>
            <div className="flex flex-row items-center bg-transparent hover:bg-[#ccc] px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2">
              <IoIosHelpCircleOutline className="w-[16px] h-[16px] object-contain" />
              <span className="text-[14px] text-p-text ">Help Center</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <p>
          Create an account to follow your favorite communities and start taking
          part in conversations.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {user && address && (
          <div className="flex flex-col gap-4">
            <button
              className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-ap-text bg-p-btn py-2 px-2 md:px-6 lg:px-12"
              onClick={createPost}
            >
              Create Post
            </button>
            <div
              className="flex flex-row bg-[#FFFFFF] rounded-full items-center justify-between py-1 pr-1 md:pr-2 hover:cursor-pointer h-[50px] gap-2 md:gap-4"
              onClick={showMoreOptions}
            >
              {user?.profileImageUrl && (
                <img
                  src={user.profileImageUrl}
                  className="w-[55px] h-[55px] rounded-full"
                />
              )}
              {user && !user.profileImageUrl && (
                <Image
                  src="/gradient.jpg"
                  width="55"
                  height="55"
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                {user?.name && <div>{stringToLength(user?.name, 8)}</div>}
                <div
                  className="flex flex-row items-center cursor-pointer"
                  onClick={handleWalletAddressCopy}
                >
                  <div className="text-base sm:text-lg">
                    {stringToLength(user.walletAddress, 8)}
                  </div>
                  <FaRegCopy className="w-8 h-8 px-2" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {!user && !address && <LoginButton />} */}
        {!user && !address && (
          <button
            className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-ap-text bg-p-btn py-2 px-2 md:px-6 lg:px-12"
            onClick={openConnectModal}
          >
            Start Creating
          </button>
        )}
        {!user && address && (
          <div className="flex flex-col w-full">
            <div className="text-sm text-red-600">Not whitelisted</div>
            <button
              className="font-bold flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-ap-text bg-p-btn py-2 px-2 md:px-6 lg:px-12 hover:cursor-pointer"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeftSidebar
