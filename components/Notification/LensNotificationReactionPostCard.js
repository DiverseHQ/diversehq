import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import { useRouter } from 'next/router'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { ImArrowUp, ImArrowDown } from 'react-icons/im'

const LensNotificationReactionPostCard = ({ notification, isRead }) => {
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
    <CommonNotificationCardLayoutUI
      MainRow={() => (
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
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <div>
          {notification?.publication?.metadata?.name !==
            'Created with DiverseHQ' && (
            <div className="font-medium text-base sm:text-lg w-full">
              {notification?.publication?.metadata?.name}
            </div>
          )}
          {notification?.publication?.metadata?.name !==
            notification?.publication?.metadata?.content && (
            <div
              className={`${
                showMore ? 'h-[100px]' : ''
              } overflow-hidden break-words`}
            >
              <Markup
                className={`${
                  showMore ? 'line-clamp-5' : ''
                } linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
              >
                {notification?.publication?.metadata?.content}
              </Markup>
            </div>
          )}
          {showMore && (
            <Link
              href={`/p/${notification?.publication?.id}`}
              className="text-blue-400 text-sm sm:text-base"
            >
              Show more
            </Link>
          )}
        </div>
      )}
      Icon={() =>
        notification?.reaction === 'UPVOTE' ? <ImArrowUp /> : <ImArrowDown />
      }
      isRead={isRead}
    />
  )
}

export default LensNotificationReactionPostCard
