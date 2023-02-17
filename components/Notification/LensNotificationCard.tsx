import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'
import { Notification } from '../../graphql/generated'
import LensNotificationCollectCard from './LensNotificationCollectCard'
import LensNotificationReactionCard from './LensNotificationReactionCard'
import { useLensUserContext } from '../../lib/LensUserContext'

const LensNotificationCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  const { data: lensProfile } = useLensUserContext()
  if (
    notification?.__typename === 'NewFollowerNotification' &&
    !notification?.wallet?.defaultProfile
  ) {
    return <></>
  }
  if (
    notification?.__typename === 'NewCommentNotification' &&
    notification?.profile?.id === lensProfile?.defaultProfile?.id
  ) {
    return <></>
  }

  if (
    notification?.__typename === 'NewReactionNotification' &&
    notification?.profile?.id === lensProfile?.defaultProfile?.id
  ) {
    return <></>
  }

  if (
    notification?.__typename === 'NewCollectNotification' &&
    (!notification?.wallet?.defaultProfile ||
      notification?.wallet?.defaultProfile?.id ===
        lensProfile?.defaultProfile?.id)
  ) {
    return <></>
  }
  return (
    <div className="sm:my-3 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b border-s-border sm:border-none sm:shadow-sm w-full">
      {notification?.__typename === 'NewCommentNotification' && (
        <LensNotificationCommentedPostCard
          notification={notification}
          isRead={isRead}
        />
      )}
      {notification?.__typename === 'NewFollowerNotification' && (
        <LensNotificationFollowedCard
          notification={notification}
          isRead={isRead}
        />
      )}
      {notification?.__typename === 'NewReactionNotification' && (
        <LensNotificationReactionCard
          notification={notification}
          isRead={isRead}
        />
      )}

      {notification?.__typename === 'NewMentionNotification' && (
        <LensNotificationMentionCard
          notification={notification}
          isRead={isRead}
        />
      )}
      {notification?.__typename === 'NewCollectNotification' && (
        <LensNotificationCollectCard
          notification={notification}
          isRead={isRead}
        />
      )}
    </div>
  )
}

export default LensNotificationCard
