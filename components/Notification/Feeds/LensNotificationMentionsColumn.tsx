import InfiniteScroll from 'react-infinite-scroll-component'
import {
  Notification,
  NotificationTypes,
  useNotificationsQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { LENS_NOTIFICATION_LIMIT } from '../../../utils/config'
import { useDevice } from '../../Common/DeviceWrapper'
import LensLoginButton from '../../Common/LensLoginButton'
import { useProfile } from '../../Common/WalletContext'
import React, { useEffect, useState } from 'react'
import MobileLoader from '../../Common/UI/MobileLoader'
import LensNotificationCard from '../LensNotificationCard'

const LensNotificationMentionsColumn = () => {
  const { user } = useProfile()

  const [params, setParams] = useState<{
    notifications: Notification[]
    hasMore: boolean
    cursor: string | null
    nextCursor: string | null
    highSignalFilter: boolean
  }>({
    notifications: [],
    hasMore: true,
    cursor: null,
    nextCursor: null,
    highSignalFilter: user?.preferences?.highSignalNotifications ?? true
  })

  const { isMobile } = useDevice()

  const { data: lensProfile, isSignedIn, hasProfile } = useLensUserContext()
  const { data } = useNotificationsQuery(
    {
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        cursor: params.cursor,
        limit: LENS_NOTIFICATION_LIMIT,
        notificationTypes: [
          NotificationTypes.MentionComment,
          NotificationTypes.MentionPost
        ],
        highSignalFilter: params.highSignalFilter
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!lensProfile?.defaultProfile?.id && isSignedIn && hasProfile
    }
  )

  useEffect(() => {
    setParams({
      ...params,
      notifications: [],
      hasMore: true,
      cursor: null,
      nextCursor: null,
      highSignalFilter: user?.preferences?.highSignalNotifications ?? true
    })
  }, [user?.preferences?.highSignalNotifications])

  const getMoreNotifications = async () => {
    if (params.nextCursor) {
      setParams({
        ...params,
        cursor: params.nextCursor
      })
      return
    }
  }

  useEffect(() => {
    if (!data?.notifications?.items) return
    handleNotifications()
  }, [data?.notifications?.pageInfo?.next])

  const handleNotifications = async () => {
    setParams({
      ...params,
      // @ts-ignore
      notifications:
        data.notifications.items.length > 0
          ? [...params.notifications, ...data.notifications.items]
          : params.notifications,
      hasMore:
        Number(data?.notifications?.items?.length) !== 0 &&
        data.notifications.items.length === LENS_NOTIFICATION_LIMIT,
      nextCursor: data?.notifications?.pageInfo?.next ?? params.nextCursor
    })
    // if (data.notifications.items.length > 0) {
    //   const newNotifications = data.notifications.items

    //   // @ts-ignore
    //   setNotifications([...notifications, ...newNotifications])
    // }
    // if (data.notifications.items.length === 0) {
    //   setHasMore(false)
    //   return
    // }
    // if (data?.notifications?.pageInfo?.next) {
    //   setNextCursor(data?.notifications?.pageInfo?.next)
    // }
    // if (data.notifications.items.length < LENS_NOTIFICATION_LIMIT) {
    //   setHasMore(false)
    // }
  }

  return (
    <>
      {lensProfile &&
        isSignedIn &&
        hasProfile &&
        lensProfile?.defaultProfile?.id && (
          <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden mb-4">
            <InfiniteScroll
              dataLength={params.notifications.length}
              next={getMoreNotifications}
              hasMore={params.hasMore}
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
              {params.notifications.map((notification, index) => {
                return (
                  <LensNotificationCard
                    key={index}
                    notification={notification}
                    isRead={
                      notification.createdAt <
                      (user?.lastFetchedNotificationsTime
                        ? user?.lastFetchedNotificationsTime
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

export default LensNotificationMentionsColumn