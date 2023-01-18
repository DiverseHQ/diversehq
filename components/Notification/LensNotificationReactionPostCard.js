import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import { useRouter } from 'next/router'

const LensNotificationReactionPostCard = ({ notification }) => {
  const router = useRouter()
  const [showMore, setShowMore] = useState(
    (countLinesFromMarkdown(notification?.publication?.metadata?.content) >
      MAX_CONTENT_LINES ||
      notification?.publication?.metadata?.content.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (countLinesFromMarkdown(notification?.publication?.metadata?.content) >
        MAX_CONTENT_LINES ||
        notification?.publication?.metadata?.content.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [notification?.publication])
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
      {notification?.publication?.metadata?.name !==
        'Created with DiverseHQ' && (
        <div className="font-medium text-lg w-full">
          {notification?.publication?.metadata?.name}
        </div>
      )}
      {notification?.publication?.metadata?.name !==
        notification?.publication?.metadata?.content && (
        <div
          className={`${
            showMore ? 'h-[150px]' : ''
          } overflow-hidden break-words`}
        >
          <Markup
            className={`${
              showMore ? 'line-clamp-5' : ''
            } linkify whitespace-pre-wrap break-words text-xs sm:text-base`}
          >
            {notification?.publication?.metadata?.content}
          </Markup>
        </div>
      )}
      {showMore && (
        <Link
          href={`/p/${notification?.publication?.id}`}
          className="text-blue-400"
        >
          Show more
        </Link>
      )}
    </div>
  )
}

export default LensNotificationReactionPostCard
