import { useRouter } from 'next/router'
import React from 'react'
import { BsFileRuled } from 'react-icons/bs'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { MdGroups } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { VscOpenPreview } from 'react-icons/vsc'
import { LensCommunity } from '../../../types/community'
import MobileTopNavbarWithTitle from '../../Common/MobileTopNavbarWithTitle'
import MobileSidebar from '../../Settings/MobileSidebar'
import LensCommunitySettingsPage from './LensCommunitySettingsPage'
import { useDevice } from '../../Common/DeviceWrapper'
// import VerifiedBadge from '../../Common/UI/Icon/VerifiedBadge'

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
              link: `/l/${name}/settings/community`,
              icon: (
                <MdGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            },
            {
              title: 'Review Post Requests',
              link: `/l/${name}/settings/review-posts`,
              icon: (
                <VscOpenPreview className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            },
            {
              title: 'User Management',
              link: `/l/${name}/settings/user-management`,
              icon: (
                <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            },
            {
              title: 'Reported Posts',
              link: `/l/${name}/settings/reports`,
              icon: (
                <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            },
            {
              title: 'Rules',
              link: `/l/${name}/settings/rules`,
              icon: (
                <BsFileRuled className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            }
            // {
            //   title: 'Verification',
            //   link: `/l/${name}/settings/verification`,
            //   icon: (
            //     <VerifiedBadge className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
            //   ),
            //   disabled: true
            // }
          ]}
        />
      ) : (
        <LensCommunitySettingsPage community={community} />
      )}
    </>
  )
}

export default LensCommunitySettingsIndexPage
