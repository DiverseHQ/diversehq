import React from 'react'
import useDevice from '../../components/Common/useDevice'
import LensNotificationColumn from '../../components/Notification/LensNotificationColumn'
import NotificationFilterNav from '../../components/Notification/NotificationFilterNav'
import NotificationSeo from '../../components/Notification/NotificationSeo'

const lens = () => {
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

export default lens
