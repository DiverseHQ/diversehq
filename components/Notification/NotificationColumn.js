import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllNotifications } from '../../api/user'
import { NOTIFICATION_LIMIT } from '../../utils/config'
import { useProfile } from '../Common/WalletContext'
import NotificationCard from './NotificationCard'
import useNotificationCount from './useNotificationsCount'
const NotificationColumn = () => {
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { fetchAndSetNotificationCount } = useNotificationCount()
  const { user } = useProfile()

  const getMoreNotifications = async () => {
    try {
      if (!hasMore) return
      const fetchedNotifications = await getAllNotifications(
        NOTIFICATION_LIMIT,
        notifications.length
      )
      console.log('fetchedNotifications', fetchedNotifications)
      if (fetchedNotifications.length < NOTIFICATION_LIMIT) {
        setHasMore(false)
      }
      setNotifications([...notifications, ...fetchedNotifications])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAndSetNotificationCount()
      getMoreNotifications()
    }
  }, [user])

  return (
    <div>
      <div>
        <InfiniteScroll
          dataLength={notifications.length}
          next={getMoreNotifications}
          hasMore={hasMore}
          loader={<h3>Loading...</h3>}
          endMessage={<></>}
        >
          {notifications.map((notification, index) => {
            return <NotificationCard key={index} notification={notification} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default NotificationColumn
