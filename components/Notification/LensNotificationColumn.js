import React, { useEffect, useState } from 'react'
import {
  NotificationTypes,
  useNotificationsQuery
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_NOTIFICATION_LIMIT } from '../../utils/config'
import InfiniteScroll from 'react-infinite-scroll-component'
import LensNotificationCard from './LensNotificationCard'
import LensLoginButton from '../Common/LensLoginButton'

const LensNotificationColumn = () => {
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)

  const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  const { data } = useNotificationsQuery(
    {
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        cursor: cursor,
        limit: LENS_NOTIFICATION_LIMIT,
        notificationTypes: [
          NotificationTypes.CommentedPost,
          NotificationTypes.CommentedComment,
          NotificationTypes.Followed,
          NotificationTypes.ReactionPost,
          NotificationTypes.ReactionComment
        ]
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!lensProfile?.defaultProfile?.id && isSignedIn && hasProfile
    }
  )
  const getMoreNotifications = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
  }

  useEffect(() => {
    if (!data?.notifications?.items) return
    handleNotifications()
  }, [data?.notifications?.pageInfo?.next])

  const handleNotifications = async () => {
    console.log('data.notifications.items', data.notifications.items)
    if (data.notifications.items.length > 0) {
      setNotifications([...notifications, ...data.notifications.items])
    }
    if (data.notifications.items.length === 0) {
      setHasMore(false)
      return
    }
    if (data?.notifications?.pageInfo?.next) {
      setNextCursor(data?.notifications?.pageInfo?.next)
    }
    if (data.notifications.items.length < LENS_NOTIFICATION_LIMIT) {
      setHasMore(false)
    }
  }

  return (
    <>
      {lensProfile &&
        isSignedIn &&
        hasProfile &&
        lensProfile?.defaultProfile?.id && (
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
                  <LensNotificationCard
                    key={index}
                    notification={notification}
                  />
                )
              })}
            </InfiniteScroll>
          </div>
        )}
      {(!isSignedIn || !hasProfile) && (
        <div className="flex flex-col mt-10 items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in lens to view lens notifications
          </h1>
          <LensLoginButton />
        </div>
      )}
    </>
  )
}

export default LensNotificationColumn