import React from 'react'
import NotificationSeo from '../../components/Notification/NotificationSeo'
import NotificationFilter from '../../components/Notification/NotificationNav/NotificationFilter'
import LensNotificationMentionsColumn from '../../components/Notification/Feeds/LensNotificationMentionsColumn'

const mentions = () => {
  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* notifications */}
          <NotificationFilter />
          <LensNotificationMentionsColumn />
        </div>
      </div>
    </>
  )
}

export default mentions
