import React from 'react'
import LensNotificationColumn from '../../components/Notification/LensNotificationColumn'
import NotificationSeo from '../../components/Notification/NotificationSeo'

const lens = () => {
  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* notifications */}
          <LensNotificationColumn />
        </div>
      </div>
    </>
  )
}

export default lens
