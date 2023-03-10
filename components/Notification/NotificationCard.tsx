import React from 'react'
import { notificationTypes } from '../../utils/config'
// import NotificationCommentedPostCard from './NotificationCommentedPostCard'
// import NotificationCommentUpvote from './NotificationCommentUpvote'
// import NotificationPostCreated from './NotificationPostCreated'
// import NotificationPostUpvote from './NotificationPostUpvote'
import { NotificationSchema } from '../../types/notification'
import NotificationModeratorAssignedCard from './NotificationModeratorAssignedCard'
import NotificationModeratorRemoveCard from './NotificationModeratorRemoveCard'
import NotificationBannedUserCard from './NotificationBannedUserCard'
import NotificationUnbannedUserCard from './NotificationUnbannedUserCard'

const NotificationCard = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  if (notification.type === notificationTypes.COMMENT) return <></>
  if (notification.type === notificationTypes.POST) return <></>
  if (notification.type === notificationTypes.UPVOTE_COMMENT) return <></>
  if (notification.type === notificationTypes.UPVOTE_POST) return <></>

  return (
    <div className="px-3 py-2 sm:px-2 sm:py-4 border-b border-s-border w-full hover:bg-s-hover cursor-pointer">
      {/* {notification.type === notificationTypes.COMMENT && (
        <NotificationCommentedPostCard notification={notification} />
      )}
      {notification.type === notificationTypes.POST && (
        <NotificationPostCreated notification={notification} />
      )}
      {notification.type === notificationTypes.UPVOTE_COMMENT && (
        <NotificationCommentUpvote notification={notification} />
      )}
      {notification.type === notificationTypes.UPVOTE_POST && (
        <NotificationPostUpvote notification={notification} />
      )} */}
      {notification.type === notificationTypes.MODERATOR_ASSIGNED && (
        <NotificationModeratorAssignedCard notification={notification} />
      )}
      {notification.type === notificationTypes.MODERATOR_REMOVED && (
        <NotificationModeratorRemoveCard notification={notification} />
      )}
      {notification.type === notificationTypes.BAN_USER && (
        <NotificationBannedUserCard notification={notification} />
      )}
      {notification.type === notificationTypes.UNBAN_USER && (
        <NotificationUnbannedUserCard notification={notification} />
      )}
    </div>
  )
}

export default NotificationCard
