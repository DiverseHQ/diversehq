import React from 'react'
import LensNotificationCommentedPostCard from './LensNotificationCommentedPostCard'
import LensNotificationFollowedCard from './LensNotificationFollowedCard'
import LensNotificationReactionPostCard from './LensNotificationReactionPostCard'
import LensNotificationMentionCard from './LensNotificationMentionCard'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const NotificationTypeName = {
  NewFollowerNotification: 'NewFollowerNotification',
  NewCommentNotification: 'NewCommentNotification',
  NewReactionNotification: 'NewReactionNotification',
  NewMentionNotification: 'NewMentionNotification'
}

const LensNotificationCard = ({ notification }) => {
  return (
    <div className="justify-between my-4 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b sm:border-none shadow-sm flex flex-row w-full">
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
      <div>
        {notification?.__typename ===
          NotificationTypeName.NewMentionNotification && (
          <LensNotificationMentionCard notification={notification} />
        )}
      </div>
      <div className="items-end shrink-0">
        <ReactTimeAgo date={notification?.createdAt} locale="en-US" />
      </div>
    </div>
  )
}

export default LensNotificationCard
