import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { stringToLength } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import { useRouter } from 'next/router'

const NotificationPostCreated = ({ notification }) => {
  const router = useRouter()

  const [showMore, setShowMore] = useState(
    (countLinesFromMarkdown(notification.post?.content) > MAX_CONTENT_LINES ||
      notification.post?.content?.length > 400 ||
      countLinesFromMarkdown(notification.post?.titile) > MAX_CONTENT_LINES ||
      notification.post?.title?.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (countLinesFromMarkdown(notification?.post?.content) >
        MAX_CONTENT_LINES ||
        notification?.post?.content?.length > 400 ||
        countLinesFromMarkdown(notification?.post?.title) > MAX_CONTENT_LINES ||
        notification?.post?.title?.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [notification?.post])

  return (
    <div className="px-2 flex flex-col w-full">
      <div>
        <span className="hover:underline font-bold">
          <Link href={`/u/${notification?.sender?.walletAddress}`}>
            {notification?.sender?.name
              ? `u/${notification?.sender?.name}`
              : `u/${stringToLength(notification?.sender?.walletAddress, 10)}`}
          </Link>
        </span>
        <span>{' created a '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/p/${notification?.post?._id}`}>Post</Link>
        </span>
        <span>{' in your '}</span>
        <span className="hover:underline font-bold">
          <Link href={`/c/${notification?.post?.communityId}`}>Community</Link>
        </span>
      </div>
      {notification?.post?.title?.length <= 60 && (
        <div className="font-medium text-base sm:text-lg w-full">
          {notification?.post?.title}
        </div>
      )}
      {(notification?.post?.content ||
        notification?.post?.title?.length > 60) && (
        <>
          <div
            className={`${
              showMore ? 'h-[100px]' : ''
            } overflow-hidden break-words`}
          >
            <Markup
              className={`${
                showMore ? 'line-clamp-5' : ''
              } linkify line-clamp-2 whitespace-pre-wrap max-h-[10px] overflow-hide break-words text-sm sm:text-base`}
            >
              {notification?.post?.content
                ? notification?.post?.content
                : notification?.post?.title}
            </Markup>
          </div>
          {showMore && (
            <Link
              href={`/p/${notification?.post._id}`}
              className="text-blue-400"
            >
              Show more
            </Link>
          )}
        </>
      )}
    </div>
  )
}

export default NotificationPostCreated
