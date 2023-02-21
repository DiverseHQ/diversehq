import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useDisconnect } from 'wagmi'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'

import { CgProfile } from 'react-icons/cg'
import { AiOutlineDisconnect } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'

const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { disconnect } = useDisconnect()
  const { hideModal } = usePopUpModal()

  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
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

  return (
    <MoreOptionsModal
      list={[
        {
          label: 'Settings',
          onClick: routeToSettings,
          icon: () => <FiSettings className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        },
        {
          label: 'View Profile',
          onClick: routeToUserProfile,
          icon: () => <CgProfile className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        },
        {
          label: 'Disconnect',
          onClick: disconnectAndClear,
          icon: () => (
            <AiOutlineDisconnect className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
          )
        }
      ]}
    />
  )
}

export default ClickOption
