import Link from 'next/link'
import React from 'react'

const NotificationCommentedPostCard = ({ notification }) => {
  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.sender?.walletaddress}`}>
            {notification?.sender?.name
              ? `u/${notification?.sender?.name}`
              : `u/${notification?.sender?.walletaddress}`}
          </Link>
        </span>
        <span>{' commented on your '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.comment?.postId}`}>Post</Link>
        </span>
      </div>
      <div className="text-s-text">{notification?.comment?.content}</div>
    </div>
  )
}

export default NotificationCommentedPostCard
