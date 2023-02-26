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
import { useProfile } from '../Common/WalletContext'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'

const LensNotificationColumn = () => {
  const [notifications, setNotifications] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { isMobile } = useDevice()

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
          NotificationTypes.ReactionComment,
          NotificationTypes.MentionPost,
          NotificationTypes.MentionComment,
          NotificationTypes.CollectedComment,
          NotificationTypes.CollectedPost
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

  const { user, refreshUserInfo } = useProfile()

  useEffect(() => {
    return async () => {
      await refreshUserInfo()
    }
  }, [])
  return (
    <>
      {lensProfile &&
        isSignedIn &&
        hasProfile &&
        lensProfile?.defaultProfile?.id && (
          <div className="sm:rounded-2xl bg-s-bg my-4">
            <InfiniteScroll
              dataLength={notifications.length}
              next={getMoreNotifications}
              hasMore={hasMore}
              loader={
                isMobile ? (
                  <MobileLoader />
                ) : (
                  <>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                    <div className="w-full sm:rounded-xl  bg-gray-100 dark:bg-s-bg animate-pulse my-4 px-3 py-2 sm:p-3 border-b sm:border-none shadow-sm">
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                      <div className="w-full flex flex-row items-center space-x-4 p-2">
                        <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                        <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                      </div>
                    </div>
                  </>
                )
              }
              endMessage={<></>}
            >
              {notifications.map((notification, index) => {
                return (
                  <LensNotificationCard
                    key={index}
                    notification={notification}
                    isRead={
                      notification.createdAt <
                      (user?.lastFetchedLensNotificationsTime
                        ? user?.lastFetchedLensNotificationsTime
                        : new Date())
                    }
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
