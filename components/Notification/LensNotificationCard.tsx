import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'
import { Notification } from '../../graphql/generated'
import LensNotificationCollectCard from './LensNotificationCollectCard'
import LensNotificationReactionCard from './LensNotificationReactionCard'
import NotificationMirroredCard from './NotificationMirroredCard'
// import { useLensUserContext } from '../../lib/LensUserContext'

const LensNotificationCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  return (
    <div className="px-3 py-2 sm:px-2 sm:py-4 border-b border-s-border w-full hover:bg-s-hover cursor-pointer">
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
      {notification?.__typename === 'NewMirrorNotification' && (
        <NotificationMirroredCard notification={notification} isRead={isRead} />
      )}
    </div>
  )
}

export default LensNotificationCard
