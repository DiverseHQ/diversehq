import Link from 'next/link'
import React from 'react'

const LensNotificationCommentedPostCard = ({ notification }) => {
  console.log('notification', notification)
  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.profile?.handle}`}>
            u/{notification?.profile?.handle}
          </Link>
        </span>
        <span>{' commented on your '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.comment?.commentOn?.id}`}>Post</Link>
        </span>
      </div>
      <div className="text-s-text">
        {notification?.comment?.metadata?.content}
      </div>
    </div>
  )
}

export default LensNotificationCommentedPostCard
