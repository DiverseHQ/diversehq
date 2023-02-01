import React from 'react'
import { notificationTypes } from '../../utils/config'
import NotificationCommentedPostCard from './NotificationCommentedPostCard'
import NotificationCommentUpvote from './NotificationCommentUpvote'
import NotificationPostCreated from './NotificationPostCreated'
import NotificationPostUpvote from './NotificationPostUpvote'

const NotificationCard = ({ notification }) => {
  return (
    <div
      className={
        'my-1 sm:my-4 px-3 py-2 sm:p-3 sm:bg-s-bg sm:rounded-xl border-b sm:border-none shadow-sm w-full'
      }
    >
      {notification.type === notificationTypes.COMMENT && (
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
      )}
    </div>
  )
}

export default NotificationCard
