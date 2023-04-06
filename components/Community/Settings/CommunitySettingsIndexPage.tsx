import React from 'react'
import MobileTopNavbarWithTitle from '../../Common/MobileTopNavbarWithTitle'
import MobileSidebar from '../../Settings/MobileSidebar'
import { MdAddModerator, MdGroups, MdVerified } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { BsFileRuled } from 'react-icons/bs'
import CommunitySettingsPage from './CommunitySettingsPage'
import { useRouter } from 'next/router'
import useIsCreator from '../hook/useIsCreator'
import { CommunityType } from '../../../types/community'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { useDevice } from '../../Common/DeviceWrapper'
// import AuthCreatorOfCommunity from '../AuthCreatorOfCommunity'
// import AuthCommunity from '../AuthCommunity'

const CommunitySettingsIndexPage = ({
  community
}: {
  community: CommunityType
}) => {
  const { isMobile } = useDevice()
  const router = useRouter()
  const { name } = router.query
  const { isCreator } = useIsCreator({
    name: String(name),
    callBackForNotCreator: () => {
      if (!isMobile) {
        router.push(`/c/${name}/settings/user-management`)
      }
    }
  })
  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Settings" />}
      {isMobile ? (
        <MobileSidebar
          items={
            isCreator
              ? [
                  {
                    title: 'Community',
                    link: `/c/${name}/settings/community`,
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
                    title: 'User Management',
                    link: `/c/${name}/settings/user-management`,
                    icon: (
                      <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                    )
                  },
                  {
                    title: 'Reported Posts',
                    link: `/c/${name}/settings/reports`,
                    icon: (
                      <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
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
                    title: 'Members',
                    link: `/c/${name}/settings/user-management`,
                    icon: (
                      <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                    )
                  },
                  {
                    title: 'Reported Posts',
                    link: `/c/${name}/settings/reports`,
                    icon: (
                      <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                    )
                  }
                ]
          }
        />
      ) : (
        <CommunitySettingsPage community={community} />
      )}
    </>
  )
}

export default CommunitySettingsIndexPage
