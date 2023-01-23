import React from 'react'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { usePopUpModal, modalType } from '../Common/CustomPopUpProvider'
import CreateCommunity from './CreateCommunity'
import CreatePostPopup from './CreatePostPopup'

import { AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link'
import { DISCORD_INVITE_LINK, userRoles } from '../../utils/config'
import { FaDiscord } from 'react-icons/fa'

const NewLeftSidebar = () => {
  const { user } = useProfile()
  const { showModal } = usePopUpModal()

  const { notifyInfo } = useNotify()

  const createCommunity = () => {
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

  const createPost = () => {
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
    <div className="relative flex flex-col items-start sticky top-[64px] right-0 h-[calc(100vh-62px)] py-8 pl-4 md:pl-6 lg:pl-10 xl:pl-12 pr-2 md:pr-2 lg:pr-4 xl:pr-6 w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] gap-4">
      <div className="flex flex-col rounded-[15px] relative">
        <img src="/diverseBanner.png" className="h-[80px]" />
        <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
          <div className="flex flex-row gap-2 justify-start">
            <div className="flex items-center justify-center rounded-full bg-[#000] w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] -translate-y-6">
              <img
                src="/LogoV3TrimmedWithBG.png"
                className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]"
                alt="DivrseHQ Logo"
              />
            </div>
            <h2 className="font-semibold text-[18px] text-p-text">DiverseHQ</h2>
          </div>
          <p className="mb-2 -translate-y-4 text-p-text">
            Your personal Reddit frontpage. Come here to check in with your
            favorite communities.
          </p>
          <button
            className="flex flex-row items-center justify-center w-full rounded-[10px] text-[16px] font-semibold text-p-btn-text bg-p-btn dark:bg-p-text dark:text-s-bg py-2 px-2 mb-3"
            onClick={createPost}
          >
            Create Post
          </button>
          <button
            className="flex flex-row items-center justify-center w-full px-2 py-2 rounded-[10px] border-[1px] border-p-btn dark:border-p-text text-p-btn dark:text-p-text text-[16px] font-semibold"
            onClick={createCommunity}
          >
            Create Community
          </button>
        </div>
      </div>
      <div className="bg-[#EDE7FF] dark:bg-s-bg w-full rounded-[15px] border-[1px] border-p-border">
        <Link
          className="flex flex-row items-center hover:bg-p-hover hover:text-p-hover-text px-2 py-2 md:px-4 rounded-[15px] gap-1 md:gap-2 text-p-text"
          href={'/'}
        >
          <AiOutlineHome className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          <span className="text-[16px] font-medium">Home</span>
        </Link>
        <a
          href={DISCORD_INVITE_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center bg-transparent hover:bg-p-hover hover:text-p-hover-text px-2 py-2 md:px-4 rounded-[15px] gap-1 md:gap-2 relative w-full text-p-text"
        >
          <FaDiscord className="w-[24px] h-[24px] object-contain" />
          <span className="text-[16px] font-medium">Discord</span>
        </a>
      </div>
    </div>
  )
}

export default NewLeftSidebar
