import { useRouter } from 'next/router'
import React from 'react'
import { BsFileRuled } from 'react-icons/bs'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { MdGroups, MdVerified } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { LensCommunity } from '../../../types/community'
import MobileTopNavbarWithTitle from '../../Common/MobileTopNavbarWithTitle'
import useDevice from '../../Common/useDevice'
import MobileSidebar from '../../Settings/MobileSidebar'
import LensCommunitySettingsPage from './LensCommunitySettingsPage'

const LensCommunitySettingsIndexPage = ({
  community
}: {
  community: LensCommunity
}) => {
  const { isMobile } = useDevice()
  const router = useRouter()
  const { name } = router.query
  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Settings" />}
      {isMobile ? (
        <MobileSidebar
          items={[
            {
              title: 'Community',
              link: `/c/${name}/settings/community`,
              icon: (
                <MdGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
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
          ]}
        />
      ) : (
        <LensCommunitySettingsPage community={community} />
      )}
    </>
  )
}

export default LensCommunitySettingsIndexPage
