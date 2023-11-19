import { useEffect, useState } from 'react'
import {
  getUnReadNotificationsCount,
  putUpdateLensNotificationDate
} from '../../apiHelper/user'
// import {
//   CustomFiltersType,
//   useNotificationsCreatedAtQuery
// } from '../../graphql/generated'
// import { useLensUserContext } from '../../lib/LensUserContext'
import { useProfile } from '../Common/WalletContext'

const useNotificationsCount = (): {
  notificationsCount: number
  updateNotificationCount: (
    // eslint-disable-next-line no-unused-vars
    alsoUpdateLastFetchedTime?: Boolean
  ) => Promise<void>
  updateLastFetchedNotificationTime: () => Promise<void>
} => {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [lensNotificationsCount, setLensNotificationsCount] = useState(0)
  const { user, refreshUserInfo } = useProfile()
  // const { data: lensProfile } = useLensUserContext()
  // const { data } = useNotificationsCreatedAtQuery(
  //   {
  //     request: {
  //       where: {
  //         highSignalFilter: user?.preferences?.highSignalNotifications ?? true,
  //         customFilters: [CustomFiltersType.Gardeners]
  //       }
  //     }
  //   },
  //   {
  //     enabled: !!lensProfile?.defaultProfile?.id && !!user
  //   }
  // )

  // useEffect(() => {
  //   if (data?.notifications?.items?.length > 0 && user) {
  //     setLensNotificationsCount(
  //       data?.notifications?.items?.filter(
  //         (notification) =>
  //           notification.id >
  //           (user.lastFetchedNotificationsTime
  //             ? user.lastFetchedNotificationsTime
  //             : new Date())
  //       ).length
  //     )
  //   }
  // }, [data?.notifications, user?.lastFetchedNotificationsTime])

  const fetchAndSetNotificationCount = async () => {
    const { count } = await getUnReadNotificationsCount()
    console.log('count', count)
    setNotificationsCount(count)
  }

  const updateNotificationCount = async (
    alsoUpdateLastFetchedTime?: Boolean
  ) => {
    setNotificationsCount(0)
    setLensNotificationsCount(0)
    if (alsoUpdateLastFetchedTime) {
      await updateLastFetchedNotificationTime()
      await refreshUserInfo()
    }
  }

  const updateLastFetchedNotificationTime = async () => {
    try {
      await putUpdateLensNotificationDate()
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (user?.lastFetchedNotificationsTime) {
      fetchAndSetNotificationCount()
    } else {
      setNotificationsCount(0)
      setLensNotificationsCount(0)
    }
  }, [user?.lastFetchedNotificationsTime])
  return {
    notificationsCount: notificationsCount + lensNotificationsCount,
    updateNotificationCount,
    updateLastFetchedNotificationTime
  }
}

export default useNotificationsCount
