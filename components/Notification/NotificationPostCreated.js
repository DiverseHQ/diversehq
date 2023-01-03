import Link from 'next/link'
import React from 'react'

const NotificationPostCreated = ({ notification }) => {
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
        <span>{' created a '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.post._id}`}>Post</Link>
        </span>
        <span>{' in your '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/c/${notification?.post?.communityId}`}>Community</Link>
        </span>
      </div>
      <div className="text-s-text">{notification?.post?.title}</div>
    </div>
  )
}

export default NotificationPostCreated
