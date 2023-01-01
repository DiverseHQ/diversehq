import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationReactionPostCard from './LensNotificationReactionPostCard'

const NotificationTypeName = {
  NewFollowerNotification: 'NewFollowerNotification',
  NewCommentNotification: 'NewCommentNotification',
  NewReactionNotification: 'NewReactionNotification'
}

const LensNotificationCard = ({ notification }) => {
  console.log('notification', notification)
  return (
    <div className="my-2">
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
    </div>
  )
}

export default LensNotificationCard
