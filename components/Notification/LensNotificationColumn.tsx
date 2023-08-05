import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllNotificationBetweenTimes } from '../../apiHelper/user'
import { useNotificationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import getProfilesHandles from '../../lib/profile/get-profiles-handles'
import { NotificationSchema } from '../../types/notification'
import { LENS_NOTIFICATION_LIMIT } from '../../utils/config'
import { useDevice } from '../Common/DeviceWrapper'
import LensLoginButton from '../Common/LensLoginButton'
import MobileLoader from '../Common/UI/MobileLoader'
import { useProfile } from '../Common/WalletContext'
import LensNotificationCard from './LensNotificationCard'
import NotificationCard from './NotificationCard'

const LensNotificationColumn = () => {
  const { user } = useProfile()

  const [params, setParams] = useState<{
    notifications: any[]
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
        highSignalFilter: params.highSignalFilter
      },
      profileId: lensProfile?.defaultProfile?.id,
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled:
        !!lensProfile?.defaultProfile?.id &&
        isSignedIn &&
        hasProfile &&
        Boolean(user)
    }
  )
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
    let newListOfNotifications = params.notifications
    if (data.notifications.items.length > 0) {
      const newNotifications = data.notifications.items
      // add offchain notifications to newNotifications and sort it on createdAt
      let from = newNotifications[newNotifications.length - 1].createdAt
      let to = newNotifications[0].createdAt
      if (params.notifications?.length === 0) {
        to = new Date().toISOString()
      }
      try {
        const res = await getAllNotificationBetweenTimes(from, to)
        if (res.status === 200) {
          const offChainNotifications: NotificationSchema[] = await res.json()
          if (offChainNotifications.length > 0) {
            const allProfiles = []

            // loop over offChainNotifications in batches of 40
            for (let i = 0; i < offChainNotifications.length; i += 40) {
              const { profiles } = await getProfilesHandles({
                ownedBy: offChainNotifications
                  .map((n) => n.sender.walletAddress)
                  .slice(i, i + 40)
              })

              allProfiles.push(...profiles.items)
            }

            // const { profiles } = await getProfilesHandles({
            //   ownedBy: offChainNotifications.map((n) => n.sender.walletAddress)
            // })

            for (let i = 0; i < offChainNotifications.length; i++) {
              // @ts-ignore
              offChainNotifications[i].senderLensProfile = allProfiles.find(
                (p) =>
                  p.ownedBy.toLowerCase() ===
                  offChainNotifications[i].sender.walletAddress.toLowerCase()
              )
            }

            // pushing only if it's not existing already
            for (let i = 0; i < offChainNotifications.length; i++) {
              const existingNotification = newNotifications.find(
                // @ts-ignore
                (n) => n._id === offChainNotifications[i]._id
              )
              if (!existingNotification) {
                // @ts-ignore
                newNotifications.push(offChainNotifications[i])
              }
            }

            // @ts-ignore
            // newNotifications.push(...offChainNotifications)

            // sort on createdAt
            newNotifications.sort((a, b) => {
              // @ts-ignore
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
          }
        }
      } catch (error) {
        console.log(error)
      }

      // @ts-ignore
      newListOfNotifications = [...params.notifications, ...newNotifications]
    }

    setParams({
      ...params,
      notifications: newListOfNotifications,
      hasMore: Boolean(data?.notifications?.items?.length),
      nextCursor: data?.notifications?.pageInfo?.next ?? params.nextCursor
    })
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

  return (
    <>
      {lensProfile &&
        isSignedIn &&
        hasProfile &&
        lensProfile?.defaultProfile?.id && (
          <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden mb-4">
            <InfiniteScroll
              dataLength={params?.notifications?.length || 0}
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
                if (notification?._id) {
                  return (
                    <NotificationCard key={index} notification={notification} />
                  )
                }
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

export default LensNotificationColumn
