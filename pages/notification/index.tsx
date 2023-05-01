import React from 'react'
import NotificationSeo from '../../components/Notification/NotificationSeo'
import LensNotificationColumn from '../../components/Notification/LensNotificationColumn'
import NotificationFilter from '../../components/Notification/NotificationNav/NotificationFilter'
import useNotificationsCount from '../../components/Notification/useNotificationsCount'
const index = () => {
  const { updateNotificationCount } = useNotificationsCount()

  // on unmout update last fetched time
  React.useEffect(() => {
    return () => {
      updateNotificationCount(true)
    }
  }, [])

  return (
    <>
      <NotificationSeo />
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[650px]">
          {/* notifications */}
          <NotificationFilter />
          <LensNotificationColumn />
        </div>
      </div>
    </>
  )
}

export default index
