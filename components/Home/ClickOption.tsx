import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useDisconnect } from 'wagmi'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import { AiOutlineDisconnect } from 'react-icons/ai'
import { useLensUserContext } from '../../lib/LensUserContext'
import { MdCreateNewFolder } from 'react-icons/md'
// import { useTheme } from '../Common/ThemeProvider'
import { useNotify } from '../Common/NotifyContext'
import { userRoles } from '../../utils/config'
import CreateCommunity from './CreateCommunity'
import { BsFillPersonFill } from 'react-icons/bs'
import { IoMdSettings } from 'react-icons/io'
// import { HiSun } from 'react-icons/hi'
import formatHandle from '../User/lib/formatHandle'

const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { disconnect } = useDisconnect()
  const { hideModal, showModal } = usePopUpModal()
  // const { theme, toggleTheme } = useTheme()
  const { notifyInfo } = useNotify()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()

  const routeToUserProfile = () => {
    if (user && lensProfile?.defaultProfile?.handle) {
      router.push(`/u/${formatHandle(lensProfile?.defaultProfile?.handle)}`)
    }
    hideModal()
  }

  const routeToSettings = () => {
    router.push('/settings')
    hideModal()
  }

  const disconnectAndClear = () => {
    disconnect()
    hideModal()
  }

  const createCommunity = () => {
    if (!user || !isSignedIn || !hasProfile) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    if (
      user?.role >= userRoles.WHITELISTED_USER &&
      user?.communityCreationSpells <= 0
    ) {
      notifyInfo(
        'You have used all your community creation spells OR you are not a whitelisted user'
      )
      return
    }

    showModal({
      component: <CreateCommunity />,
      type: modalType.fullscreen,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
    <MoreOptionsModal
      list={[
        {
          label: 'View Profile',
          onClick: routeToUserProfile,
          icon: () => (
            <BsFillPersonFill className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
          )
        },
        {
          label: 'Settings',
          onClick: routeToSettings,
          icon: () => <IoMdSettings className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        },
        {
          label: 'Create Community',
          onClick: createCommunity,
          icon: () => (
            <MdCreateNewFolder className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
          )
        },
        {
          label: 'Disconnect',
          onClick: disconnectAndClear,
          icon: () => (
            <AiOutlineDisconnect className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
          )
        }
        // {
        //   label: theme === 'light' ? 'Dark Mode' : 'Light Mode',
        //   onClick: toggleTheme,
        //   icon: () => (
        //     <>
        //       {theme === 'light' ? (
        //         <IoIosMoon className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        //       ) : (
        //         <HiSun className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        //       )}
        //     </>
        //   )
        // }
      ]}
    />
  )
}

export default ClickOption
