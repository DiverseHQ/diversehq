import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsCollectionFill } from 'react-icons/bs'
import { Notification } from '../../graphql/generated'
import { MAX_CONTENT_LINES } from '../../utils/config'
import { countLinesFromMarkdown } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const LensNotificationCollectCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  if (notification.__typename !== 'NewCollectNotification') return null
  const [showMore, setShowMore] = useState(
    countLinesFromMarkdown(
      notification?.collectedPublication?.metadata?.content
    ) > MAX_CONTENT_LINES ||
      notification?.collectedPublication?.metadata?.content.length > 400
  )

  useEffect(() => {
    setShowMore(
      countLinesFromMarkdown(
        notification?.collectedPublication?.metadata?.content
      ) > MAX_CONTENT_LINES ||
        notification?.collectedPublication?.metadata?.content.length > 400
    )
  }, [notification?.collectedPublication])
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span>
            <Link
              href={`/u/${
                notification?.collectedPublication?.profile?.handle?.split(
                  '.'
                )[0]
              }`}
            >
              <div className="font-bold hover:underline">
                {`u/${
                  notification?.collectedPublication?.profile?.handle?.split(
                    '.'
                  )[0]
                }`}
              </div>
            </Link>
          </span>
          <span className="text-gray-500"> collected your </span>
          <span className="hover:underline font-bold">
            <Link href={`/p/${notification?.collectedPublication?.id}`}>
              <>
                {notification?.notificationId?.startsWith('collected-post-') &&
                  'Post'}
                {notification?.notificationId?.startsWith(
                  'collected-comment-'
                ) && 'Comment'}
              </>
            </Link>
          </span>
        </div>
      )}
      Body={() => (
        <>
          {notification?.collectedPublication?.metadata?.name !==
            'Created with DiverseHQ' && (
            <div className="font-medium text-base sm:text-lg w-full">
              {notification?.collectedPublication?.metadata?.name}
            </div>
          )}
          {notification?.collectedPublication?.metadata?.name !==
            notification?.collectedPublication?.metadata?.content && (
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
                {notification?.collectedPublication?.metadata?.content?.startsWith(
                  notification?.collectedPublication?.metadata?.name
                )
                  ? notification?.collectedPublication?.metadata?.content?.slice(
                      notification?.collectedPublication?.metadata?.name?.length
                    )
                  : notification?.collectedPublication?.metadata?.content}
              </Markup>
            </div>
          )}
          {showMore && (
            <Link href={`/p/${notification?.collectedPublication?.id}`}>
              <div className="text-blue-400 text-sm sm:text-base">
                Show more
              </div>
            </Link>
          )}
        </>
      )}
      createdAt={notification.createdAt}
      Icon={() => <BsCollectionFill />}
      isRead={isRead}
    />
  )
}

export default LensNotificationCollectCard
