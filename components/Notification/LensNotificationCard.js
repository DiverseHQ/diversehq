import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationReactionPostCard from './LensNotificationReactionPostCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'

const NotificationTypeName = {
  NewFollowerNotification: 'NewFollowerNotification',
  NewCommentNotification: 'NewCommentNotification',
  NewReactionNotification: 'NewReactionNotification',
  NewMentionNotification: 'NewMentionNotification'
}

const LensNotificationCard = ({ notification }) => {
  return (
    <div className="my-4 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b sm:border-none shadow-sm w-full">
      {notification?.__typename ===
        NotificationTypeName.NewCommentNotification && (
        <LensNotificationCommentedPostCard notification={notification} />
      )}
      {notification?.__typename ===
        NotificationTypeName.NewFollowerNotification && (
        <LensNotificationFollowedCard notification={notification} />
      )}
      {notification?.__typename ===
        NotificationTypeName.NewReactionNotification && (
        <LensNotificationReactionPostCard notification={notification} />
      )}

      {notification?.__typename ===
        NotificationTypeName.NewMentionNotification && (
        <LensNotificationMentionCard notification={notification} />
      )}
    </div>
  )
}

export default LensNotificationCard
