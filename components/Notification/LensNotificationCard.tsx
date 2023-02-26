import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'
import { Notification } from '../../graphql/generated'
import LensNotificationCollectCard from './LensNotificationCollectCard'
import LensNotificationReactionCard from './LensNotificationReactionCard'
// import { useLensUserContext } from '../../lib/LensUserContext'

const LensNotificationCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  return (
    <div className="sm:my-3 px-3 py-2 sm:p-2 border-b border-[#eee] dark:border-p-border w-full">
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
