import React from 'react'
import { notificationTypes } from '../../utils/config'
import NotificationCommentedPostCard from './NotificationCommentedPostCard'
import NotificationCommentUpvote from './NotificationCommentUpvote'
import NotificationPostCreated from './NotificationPostCreated'
import NotificationPostUpvote from './NotificationPostUpvote'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const NotificationCard = ({ notification }) => {
  return (
    <div
      className={`justify-between my-4 px-3 py-2 sm:p-3 ${
        notification.isRead ? 'bg-s-h-bg' : 'bg-s-bg'
      } sm:rounded-xl border-b sm:border-none shadow-sm flex flex-row w-full `}
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
      <div className="items-end shrink-0">
        <ReactTimeAgo date={notification?.createdAt} locale="en-US" />
      </div>
    </div>
  )
}

export default NotificationCard
