import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationReactionPostCard from './LensNotificationReactionPostCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'
import { Notification } from '../../graphql/generated'
import LensNotificationCollectCard from './LensNotificationCollectCard'

const LensNotificationCard = ({
  notification
}: {
  notification: Notification
}) => {
  return (
    <div className="my-4 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b sm:border-none shadow-sm w-full">
      {notification?.__typename === 'NewCommentNotification' && (
        <LensNotificationCommentedPostCard notification={notification} />
      )}
      {notification?.__typename === 'NewFollowerNotification' && (
        <LensNotificationFollowedCard notification={notification} />
      )}
      {notification?.__typename === 'NewReactionNotification' && (
        <LensNotificationReactionPostCard notification={notification} />
      )}

      {notification?.__typename === 'NewMentionNotification' && (
        <LensNotificationMentionCard notification={notification} />
      )}
      {notification?.__typename === 'NewCollectNotification' && (
        <LensNotificationCollectCard notification={notification} />
      )}
    </div>
  )
}

export default LensNotificationCard
