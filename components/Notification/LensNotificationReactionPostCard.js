import React from 'react'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Link from 'next/link'
TimeAgo.addDefaultLocale(en)

const LensNotificationReactionPostCard = ({ notification }) => {
  return (
    <div className="flex flex-row">
      <div className="px-2">
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.profile?.handle}`}>
            u/{notification?.profile?.handle}
          </Link>
        </span>
        <span>
          {notification?.reaction === 'UPVOTE' && ' upvoted your post '}
          {notification?.reaction === 'DOWNVOTE' && ' downvoted your post '}
        </span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.publication?.id}`}>
            p/{notification?.publication?.id}
          </Link>
        </span>
      </div>

      <div>
        <ReactTimeAgo date={notification?.createdAt} locale="en-US" />
      </div>
    </div>
  )
}

export default LensNotificationReactionPostCard
