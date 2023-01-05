import { useEffect, useState } from 'react'
import { getUnReadNotificationsCount } from '../../api/user'
import { useProfile } from '../Common/WalletContext'

const useNotificationsCount = () => {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const { user } = useProfile()

  const fetchAndSetNotificationCount = async () => {
    const { count } = await getUnReadNotificationsCount()
    console.log('count', count)
    setNotificationsCount(count)
  }

  useEffect(() => {
    if (user) {
      fetchAndSetNotificationCount()
    } else {
      setNotificationsCount(0)
    }
  }, [user])
  return { notificationsCount, setNotificationsCount }
}

export default useNotificationsCount
