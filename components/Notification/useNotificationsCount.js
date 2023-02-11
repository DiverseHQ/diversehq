import { useEffect, useState } from 'react'
import {
  getUnReadNotificationsCount,
  putUpdateLensNotificationDate
} from '../../api/user'
import { useNotificationsCreatedAtQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useProfile } from '../Common/WalletContext'

const useNotificationsCount = () => {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [lensNotificationsCount, setLensNotificationsCount] = useState(0)
  const { user } = useProfile()
  const { data: lensProfile } = useLensUserContext()
  const { data } = useNotificationsCreatedAtQuery(
    {
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        limit: 30
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
            (user.lastFetchedLensNotificationsTime
              ? user.lastFetchedLensNotificationsTime
              : new Date())
        ).length
      )
    }
  }, [data?.notifications])

  const fetchAndSetNotificationCount = async () => {
    const { count } = await getUnReadNotificationsCount()
    setNotificationsCount(count)
  }

  const updateNotificationCount = async () => {
    setNotificationsCount(0)
  }

  const updateLensNotificationCount = async () => {
    setLensNotificationsCount(0)
    //  update lens notification date time in db
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
    notificationsCount,
    lensNotificationsCount,
    updateNotificationCount,
    updateLensNotificationCount
  }
}

export default useNotificationsCount
