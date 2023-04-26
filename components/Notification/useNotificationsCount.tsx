import { useEffect, useState } from 'react'
import {
  getUnReadNotificationsCount,
  putUpdateLensNotificationDate
} from '../../api/user'
import { useNotificationsCreatedAtQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useProfile } from '../Common/WalletContext'

const useNotificationsCount = (): {
  notificationsCount: number
  updateNotificationCount: () => void
  updateLastFetchedNotificationTime: () => Promise<void>
} => {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [lensNotificationsCount, setLensNotificationsCount] = useState(0)
  const { user } = useProfile()
  const { data: lensProfile } = useLensUserContext()
  const { data } = useNotificationsCreatedAtQuery(
    {
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        limit: 30,
        highSignalFilter: user?.preferences?.highSignalNotifications ?? true
      }
    },
    {
      enabled: !!lensProfile?.defaultProfile?.id && !!user
    }
  )

  useEffect(() => {
    if (data?.notifications?.items?.length > 0 && user) {
      setLensNotificationsCount(
        data?.notifications?.items?.filter(
          (notification) =>
            notification.createdAt >
            (user.lastFetchedNotificationsTime
              ? user.lastFetchedNotificationsTime
              : new Date())
        ).length
      )
    }
  }, [data?.notifications])

  const fetchAndSetNotificationCount = async () => {
    const { count } = await getUnReadNotificationsCount()
    console.log('count', count)
    setNotificationsCount(count)
  }

  const updateNotificationCount = () => {
    setNotificationsCount(0)
    setLensNotificationsCount(0)
  }

  const updateLastFetchedNotificationTime = async () => {
    try {
      await putUpdateLensNotificationDate()
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAndSetNotificationCount()
    } else {
      setNotificationsCount(0)
      setLensNotificationsCount(0)
    }
  }, [user])
  return {
    notificationsCount: notificationsCount + lensNotificationsCount,
    updateNotificationCount,
    updateLastFetchedNotificationTime
  }
}

export default useNotificationsCount
