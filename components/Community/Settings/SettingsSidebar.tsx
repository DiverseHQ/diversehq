import { useRouter } from 'next/router'
import React from 'react'
import { BsFileRuled } from 'react-icons/bs'
import { MdAddModerator, MdGroups, MdVerified } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import Sidebar from '../../Settings/Sidebar'
import useIsCreator from '../hook/useIsCreator'

const SettingsSidebar = () => {
  const router = useRouter()
  const { name } = router.query
  const { isCreator } = useIsCreator({ name: String(name) })
  return (
    <Sidebar
      items={
        isCreator
          ? [
              {
                title: 'Community',
                link: `/c/${name}/settings`,
                icon: (
                  <MdGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                )
              },
              {
                title: 'Moderators',
                link: `/c/${name}/settings/moderators`,
                icon: (
                  <MdAddModerator className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                )
              },
              {
                title: 'Members',
                link: `/c/${name}/settings/user-management`,
                icon: (
                  <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                )
              },
              {
                title: 'Rules',
                link: `/c/${name}/settings/rules`,
                icon: (
                  <BsFileRuled className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                )
              },
              {
                title: 'Verification',
                link: `/c/${name}/settings/verification`,
                icon: (
                  <MdVerified className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                ),
                disabled: true
              }
            ]
          : [
              {
                title: 'User Management',
                link: `/c/${name}/settings/user-management`,
                icon: (
                  <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                )
              }
            ]
      }
    />
  )
}

export default SettingsSidebar
