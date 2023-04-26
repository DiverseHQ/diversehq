import React from 'react'
import NotificationSeo from '../../components/Notification/NotificationSeo'
import NotificationFilter from '../../components/Notification/NotificationNav/NotificationFilter'
import LensNotificationCommentsColumn from '../../components/Notification/Feeds/LensNotificationCommentsColumn'

const comments = () => {
  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* notifications */}
          <NotificationFilter />
          <LensNotificationCommentsColumn />
        </div>
      </div>
    </>
  )
}

export default comments
