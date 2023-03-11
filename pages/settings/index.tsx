import React from 'react'
import { CgProfile } from 'react-icons/cg'
import useDevice from '../../components/Common/useDevice'
import MobileSidebar from '../../components/Settings/MobileSidebar'
import ProfilePage from '../../components/Settings/ProfilePage'
import { FiSettings } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import MobileTopNavbarWithTitle from '../../components/Common/MobileTopNavbarWithTitle'
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
                <MdVerified className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
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
