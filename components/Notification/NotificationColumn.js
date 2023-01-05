import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllNotifications } from '../../api/user'
import { NOTIFICATION_LIMIT } from '../../utils/config'
import LensLoginButton from '../Common/LensLoginButton'
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
      fetchAndSetNotificationCount()
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
      {user && (
        <div>
          <InfiniteScroll
            dataLength={notifications.length}
            next={getMoreNotifications}
            hasMore={hasMore}
            loader={
              <>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
                <div className="w-full sm:rounded-xl  bg-gray-100 animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                  <div className="w-full flex flex-row items-center space-x-4 p-2">
                    <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                    <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                  </div>
                </div>
              </>
            }
            endMessage={
              <div className="w-full flex flex-row items-center text-center justify-center py-4 text-s-text text-sm">
                --- You have reached the end ---
              </div>
            }
          >
            {notifications.map((notification, index) => {
              return (
                <NotificationCard key={index} notification={notification} />
              )
            })}
          </InfiniteScroll>
        </div>
      )}
      {!user && (
        <div className="w-full flex items-center flex-row justify-center">
          <LensLoginButton />
        </div>
      )}
    </div>
  )
}

export default NotificationColumn
