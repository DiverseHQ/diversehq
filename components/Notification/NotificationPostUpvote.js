import Link from 'next/link'
import React from 'react'
import { stringToLength } from '../../utils/utils'

const NotificationPostUpvote = ({ notification }) => {
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
        <span>{' upvoted your '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.post._id}`}>Post</Link>
        </span>
      </div>
      <div className="text-s-text">{notification?.post?.title}</div>
    </div>
  )
}

export default NotificationPostUpvote
