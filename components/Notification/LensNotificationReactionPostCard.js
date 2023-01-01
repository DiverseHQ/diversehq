import React from 'react'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
TimeAgo.addDefaultLocale(en)

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
