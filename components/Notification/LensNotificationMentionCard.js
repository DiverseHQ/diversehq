import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import { useRouter } from 'next/router'

const LensNotificationMentionCard = ({ notification }) => {
  const router = useRouter()
  const [showMore, setShowMore] = useState(
    (countLinesFromMarkdown(
      notification?.mentionPublication?.metadata?.content
    ) > MAX_CONTENT_LINES ||
      notification?.mentionPublication?.metadata?.content.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (countLinesFromMarkdown(
        notification?.mentionPublication?.metadata?.content
      ) > MAX_CONTENT_LINES ||
        notification?.mentionPublication?.metadata?.content.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [notification?.mentionPublication])
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
      {notification?.mentionPublication?.metadata?.name !==
        'Created with DiverseHQ' && (
        <div className="font-medium text-lg w-full">
          {notification?.mentionPublication?.metadata?.name}
        </div>
      )}
      {notification?.mentionPublication?.metadata?.name !==
        notification?.mentionPublication?.metadata?.content && (
        <div
          className={`${
            showMore ? 'h-[100px]' : ''
          } overflow-hidden break-words`}
        >
          <Markup
            className={`${
              showMore ? 'line-clamp-5' : ''
            } linkify whitespace-pre-wrap break-words text-xs sm:text-base`}
          >
            {notification?.mentionPublication?.metadata?.content}
          </Markup>
        </div>
      )}
      {showMore && (
        <Link
          href={`/p/${notification?.mentionPublication?.id}`}
          className="text-blue-400"
        >
          Show more
        </Link>
      )}
    </div>
  )
}

export default LensNotificationMentionCard
