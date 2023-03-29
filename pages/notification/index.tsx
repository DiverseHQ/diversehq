import React from 'react'
import NotificationSeo from '../../components/Notification/NotificationSeo'
import LensNotificationColumn from '../../components/Notification/LensNotificationColumn'
const index = () => {
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

export default index
