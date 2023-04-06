import React from 'react'
import MobileTopNavbarWithTitle from '../Common/MobileTopNavbarWithTitle'
import CommonSidebar from './CommonSidebar'
import ProfileForm from './ProfileForm'
import { useDevice } from '../Common/DeviceWrapper'

const ProfilePage = () => {
  const { isMobile } = useDevice()
  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Edit Profile" />}

      <div className="sm:mx-20 sm:my-12 flex flex-row space-x-20">
        {!isMobile && (
          <div className="w-[300px]">
            <CommonSidebar />
          </div>
        )}
        <div className="w-full xl:w-[750px] bg-s-bg text-p-text sm:rounded-[15px] sm:border-[1px] sm:border-s-border sm:p-4">
          <ProfileForm />
        </div>
      </div>
    </>
  )
}

export default ProfilePage
