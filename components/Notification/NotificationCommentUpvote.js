import Link from 'next/link'
import React from 'react'
import { stringToLength } from '../../utils/utils'

const NotificationCommentUpvote = ({ notification }) => {
  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.sender?.walletAddress}`}>
            {notification?.sender?.name
              ? `u/${notification?.sender?.name}`
              : `u/${stringToLength(notification?.sender?.walletAddress, 10)}`}
          </Link>
        </span>
        <span>{' upvoted your comment of'}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.comment?.postId}`}>Post</Link>
        </span>
      </div>
      <div className="text-s-text">{notification?.comment?.content}</div>
    </div>
  )
}

export default NotificationCommentUpvote
