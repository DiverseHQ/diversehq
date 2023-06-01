import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { stringToLength } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import { useRouter } from 'next/router'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { BsFilePlus } from 'react-icons/bs'

const NotificationPostCreated = ({ notification }) => {
  const router = useRouter()

  const [showMore, setShowMore] = useState(
    (notification.post?.content?.length > 400 ||
      notification.post?.title?.length > 400) &&
      router.pathname !== '/p/[id]'
  )

  useEffect(() => {
    setShowMore(
      (notification?.post?.content?.length > 400 ||
        notification?.post?.title?.length > 400) &&
        router.pathname !== '/p/[id]'
    )
  }, [notification?.post])

  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span className="hover:underline font-bold">
            <Link href={`/u/${notification?.sender?.walletAddress}`}>
              <>
                {notification?.sender?.name
                  ? `u/${notification?.sender?.name}`
                  : `u/${stringToLength(
                      notification?.sender?.walletAddress,
                      10
                    )}`}
              </>
            </Link>
          </span>
          <span>{' created a '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/p/${notification?.post?._id}`}>Post</Link>
          </span>
          <span>{' in your '}</span>
          <span className="hover:underline font-bold">
            <Link href={`/c/${notification?.post?.communityId}`}>
              Community
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <>
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
                <Link href={`/p/${notification?.post._id}`}>
                  <div className="text-blue-400 text-sm sm:text-base">
                    Show more
                  </div>
                </Link>
              )}
            </>
          )}
        </>
      )}
      Icon={() => <BsFilePlus />}
      isRead={notification?.isRead}
    />
  )
}

export default NotificationPostCreated
