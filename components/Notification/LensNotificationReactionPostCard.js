import React from 'react'
import Link from 'next/link'

const LensNotificationReactionPostCard = ({ notification }) => {
  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.profile?.handle}`}>
            u/{notification?.profile?.handle}
          </Link>
        </span>
        <span>
          {notification?.reaction === 'UPVOTE' && ' upvoted your '}
          {notification?.reaction === 'DOWNVOTE' && ' downvoted your '}
        </span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.publication?.id}`}>Post</Link>
        </span>
      </div>
      <div className="text-s-text">
        {notification?.publication?.metadata?.content}
      </div>
    </div>
  )
}

export default LensNotificationReactionPostCard
