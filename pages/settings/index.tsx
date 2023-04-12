import React from 'react'
import { CgProfile } from 'react-icons/cg'
import MobileSidebar from '../../components/Settings/MobileSidebar'
import ProfilePage from '../../components/Settings/ProfilePage'
import { FiSettings } from 'react-icons/fi'
import MobileTopNavbarWithTitle from '../../components/Common/MobileTopNavbarWithTitle'
import { useDevice } from '../../components/Common/DeviceWrapper'
import VerifiedBadge from '../../components/Common/UI/Icon/VerifiedBadge'
const index = () => {
  const { isMobile } = useDevice()
  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Settings" />}
      {isMobile ? (
        <MobileSidebar
          items={[
            {
              title: 'Edit Profile',
              link: '/settings/profile',
              icon: (
                <CgProfile className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              )
            },
            {
              title: 'Preferences',
              link: '/settings/preferences',
              icon: (
                <FiSettings className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              ),
              disabled: true
            },
            {
              title: 'Verification',
              link: '/settings/verification',
              icon: (
                <VerifiedBadge className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
              ),
              disabled: true
            }
          ]}
        />
      ) : (
        <ProfilePage />
      )}
    </>
  )
}

export default index
