import React, { useEffect, useState } from 'react'
import { NotificationTypes, useNotificationsQuery } from '../graphql/generated'
import { useLensUserContext } from '../lib/LensUserContext'
import { LENS_NOTIFICATION_LIMIT } from '../utils/config'
import LensNotificationCard from '../components/Notification/LensNotificationCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import LensLoginButton from '../components/Common/LensLoginButton'
const notification = () => {
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
    <div className="w-full flex justify-center">
      <div className="lg:w-[650px]">
        {lensProfile &&
          isSignedIn &&
          hasProfile &&
          lensProfile?.defaultProfile?.id && (
            <div>
              <InfiniteScroll
                dataLength={notifications.length}
                next={getMoreNotifications}
                hasMore={hasMore}
                loader={<h3>Loading...</h3>}
                endMessage={<></>}
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
              Please sign in lens to view notifications
            </h1>
            <LensLoginButton />
          </div>
        )}
      </div>
    </div>
  )
}

export default notification
