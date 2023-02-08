import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'
import { Notification } from '../../graphql/generated'
import LensNotificationCollectCard from './LensNotificationCollectCard'
import LensNotificationReactionCard from './LensNotificationReactionCard'

const LensNotificationCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  return (
    <div className="my-1 sm:my-4 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b sm:border-none shadow-sm w-full">
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
