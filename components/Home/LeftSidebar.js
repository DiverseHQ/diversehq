import React from 'react'
import { useRouter } from 'next/router'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { usePopUpModal, modalType } from '../Common/CustomPopUpProvider'
import CreateCommunity from './CreateCommunity'
import CreatePostPopup from './CreatePostPopup'
import Image from 'next/image'
import ClickOption from './ClickOption'
// import LoginButton from '../Common/UI/LoginButton'
import { stringToLength } from '../../utils/utils'

import { FaDiscord } from 'react-icons/fa'
import {
  AiOutlineCompass,
  //  AiOutlineGift,
  AiOutlineHome
} from 'react-icons/ai'
import { MdOutlineGroups } from 'react-icons/md'
import {
  IoMdNotificationsOutline
  // IoIosHelpCircleOutline,
  // IoIosArrowDown,
  // IoIosArrowUp
} from 'react-icons/io'
// import { BsMoon } from 'react-icons/bs'
import Link from 'next/link'
import { DISCORD_INVITE_LINK, userRoles } from '../../utils/config'
import useNotificationsCount from '../Notification/useNotificationsCount'
import ConnectWalletAndSignInButton from '../Common/ConnectWalletAndSignInButton'
import { useLensUserContext } from '../../lib/LensUserContext'

const LeftSidebar = () => {
  // const [showMore, setShowMore] = useState(false)

  const router = useRouter()
  const { user, address } = useProfile()
  const { showModal } = usePopUpModal()
  const { data: lensProfile, hasProfile, isSignedIn } = useLensUserContext()
  const { notificationsCount, setNotificationsCount } = useNotificationsCount()
  const [showDot, setShowDot] = React.useState(true)

  const routeToNotifications = () => {
    setNotificationsCount(0)
    setShowDot(false)
    router.push('/notification')
  }

  const { notifyInfo } = useNotify()

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
    if (
      user?.role >= userRoles.WHITELISTED_USER &&
      user?.communityCreationSpells <= 0
    ) {
      notifyInfo('You have used all your community creation spells')
      return
    }

    showModal({
      component: <CreateCommunity />,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  // const handleWalletAddressCopy = () => {
  //   if (!user?.walletAddress) {
  //     notifyInfo('Please Login')
  //     return
  //   }
  //   navigator.clipboard.writeText(user?.walletAddress)
  //   notifyInfo('Copied to clipboard')
  // }

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

  return (
    <div className="relative flex flex-col items-start border-r-[1px] border-p-btn sticky top-[64px] right-0 h-[calc(100vh-62px)] py-8 px-4 md:px-6 lg:px-10 xl:px-12 w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] justify-between">
      <div className="flex flex-col items-start gap-4 mb-2">
        <Link
          className="flex flex-row items-center hover:bg-p-btn-hover px-2 py-2 lg:px-4 rounded-[20px] gap-1 md:gap-2"
          href={'/'}
        >
          <AiOutlineHome className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          <span className="text-[16px] md:text-[18px] font-semibold text-p-text ">
            Home
          </span>
        </Link>
        <button
          className="flex flex-row items-center hover:bg-p-btn-hover px-2 py-2 lg:px-4 rounded-[20px] gap-1 md:gap-2"
          onClick={createCommunity}
        >
          <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          <span className="text-[16px] md:text-[18px] font-semibold text-p-text ">
            Create Community
          </span>
        </button>
        <button
          className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2 relative"
          onClick={routeToNotifications}
        >
          <IoMdNotificationsOutline className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            Notifications
          </span>
          {/* a green count dot */}
          {notificationsCount > 0 && (
            <div className="top-2 left-4 absolute leading-[4px] p-1 text-[8px] text-p-btn-text bg-p-btn rounded-full">
              <span>{notificationsCount}</span>
            </div>
          )}
          {(notificationsCount === 0 || !notificationsCount) && showDot && (
            // a green circle
            <div className="absolute top-2 left-4 w-[8px] h-[8px] bg-p-btn rounded-full" />
          )}
        </button>
        <Link
          className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2"
          href={'/explore'}
        >
          <AiOutlineCompass className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            Explorer
          </span>
        </Link>
        <a
          href={DISCORD_INVITE_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2"
        >
          <FaDiscord className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            Discord
          </span>
        </a>
        {/* <button className="flex flex-row items-center bg-transparent hover:bg-p-btn-hover px-2 py-2 md:px-4 rounded-[20px] gap-1 md:gap-2">
          <AiOutlineGift className="w-[24px] h-[24px] object-contain" />
          <span className="text-[18px] font-semibold text-p-text ">
            XP Gift
          </span>
        </button> */}
      </div>
      {/* <div>
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
            <div className="flex flex-row items-center bg-transparent hover:bg-s-h-bg px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2">
              <BsMoon className="w-[16px] h-[16px] object-contain" />
              <span className="text-[14px] text-p-text ">Dark Mode</span>
            </div>
            <div className="flex flex-row items-center bg-transparent hover:bg-[#ccc] px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2">
              <IoIosHelpCircleOutline className="w-[16px] h-[16px] object-contain" />
              <span className="text-[14px] text-p-text ">Help Center</span>
            </div>
            <a
              href={DISCORD_INVITE_LINK}
              target={'_blank'}
              rel="noreferrer"
              className="flex flex-row items-center bg-transparent hover:bg-[#ccc] px-2 py-1 md:px-4 rounded-[20px] gap-1 md:gap-2"
            >
              <FaDiscord className="w-[16px] h-[16px] object-contain" />
              <span className="text-[14px] text-p-text ">Discord</span>
            </a>
          </div>
        )}
      </div> */}

      <div className="flex flex-col gap-2">
        {user && address && (
          <div className="flex flex-col gap-4">
            <button
              className="flex flex-row items-center justify-center w-full rounded-[20px] text-[16px] font-semibold text-p-btn-text bg-p-btn py-2 px-2 md:px-6 lg:px-12"
              onClick={createPost}
            >
              Create Post
            </button>
            <div
              className="flex flex-row bg-s-bg rounded-full items-center justify-between py-1 pr-1 md:pr-2 hover:cursor-pointer h-[50px]"
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
              <div className="flex flex-col items-start justify-center pr-1">
                {user?.name && (
                  <div className="font-bold">
                    {stringToLength(user?.name, 8)}
                  </div>
                )}
                {hasProfile && isSignedIn && (
                  <div className="text-xs">
                    {stringToLength(
                      `u/${lensProfile?.defaultProfile?.handle}`,
                      18
                    )}
                  </div>
                )}
                {/* <div
                  className="flex flex-row items-center cursor-pointer"
                  onClick={handleWalletAddressCopy}
                >
                  <div className="text-base sm:text-lg">
                    {stringToLength(user.walletAddress, 8)}
                  </div>
                  <FaRegCopy className="w-8 h-8 px-2" />
                </div> */}
              </div>
            </div>
          </div>
        )}
        {/* {!user && !address && <LoginButton />} */}
        {!user && (
          <ConnectWalletAndSignInButton
            connectWalletLabel={'Start Creating'}
            SignInLabel={'Sign In'}
            DisconnectLabel={'Disconnect'}
          />
        )}
      </div>
    </div>
  )
}

export default LeftSidebar
