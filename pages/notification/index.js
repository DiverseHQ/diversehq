import React from 'react'
import NotificationFilterNav from '../../components/Notification/NotificationFilterNav'
import NotificationSeo from '../../components/Notification/NotificationSeo'
import LensNotificationColumn from '../../components/Notification/LensNotificationColumn'
import useDevice from '../../components/Common/useDevice'
const index = () => {
  const { isDesktop } = useDevice()
  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* filter nav */}
          {isDesktop && <NotificationFilterNav />}

          {/* notifications */}
          <LensNotificationColumn />
        </div>
      </div>
    </>
  )
}

export default index
