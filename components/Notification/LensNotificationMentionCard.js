import Link from 'next/link'
import React from 'react'

const LensNotificationMentionCard = ({ notification }) => {
  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span>
          <Link
            href={`/u/${notification?.mentionPublication?.profile?.handle}`}
            className="font-bold hover:underline"
          >
            {`u/${notification?.mentionPublication?.profile?.handle}`}
          </Link>{' '}
        </span>
        <span>mentioned you in a </span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.mentionPublication?.id}`}>
            {notification?.notificationId?.startsWith('mention_post-') &&
              'Post'}
            {notification?.notificationId?.startsWith('mention_comment-') &&
              'Comment'}
          </Link>
        </span>
      </div>
      <div className="text-s-text">
        {notification?.mentionPublication?.metadata?.content}
      </div>
    </div>
  )
}

export default LensNotificationMentionCard
