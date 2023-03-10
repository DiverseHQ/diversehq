import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Markup from '../Lexical/Markup'
import { countLinesFromMarkdown } from '../../utils/utils'
import { MAX_CONTENT_LINES } from '../../utils/config'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { GoMention } from 'react-icons/go'
import formatHandle from '../User/lib/formatHandle'
import { NewMentionNotification } from '../../graphql/generated'

interface Props {
  notification: NewMentionNotification
  isRead: boolean
}

const LensNotificationMentionCard = ({ notification, isRead }: Props) => {
  const [showMore, setShowMore] = useState(
    countLinesFromMarkdown(
      notification?.mentionPublication?.metadata?.content
    ) > MAX_CONTENT_LINES ||
      notification?.mentionPublication?.metadata?.content.length > 400
  )

  useEffect(() => {
    setShowMore(
      countLinesFromMarkdown(
        notification?.mentionPublication?.metadata?.content
      ) > MAX_CONTENT_LINES ||
        notification?.mentionPublication?.metadata?.content.length > 400
    )
  }, [notification?.mentionPublication])
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/u/${formatHandle(
                notification?.mentionPublication?.profile?.handle
              )}`}
            >
              <div className="font-bold hover:underline">
                {`u/${
                  notification?.mentionPublication?.profile?.handle.split(
                    '.'
                  )[0]
                }`}
              </div>
            </Link>{' '}
          </span>
          <span>mentioned you in a </span>
          <span className="hover:underline font-bold">
            <Link href={`/p/${notification?.mentionPublication?.id}`}>
              <>
                {notification?.notificationId?.startsWith('mention-post-') &&
                  'Post'}
                {notification?.notificationId?.startsWith('mention-comment-') &&
                  'Comment'}
              </>
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <>
          {notification?.mentionPublication?.metadata?.name !==
            'Created with DiverseHQ' && (
            <div className="font-medium text-base sm:text-lg w-full">
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
                } linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
              >
                {notification?.mentionPublication?.metadata?.content?.startsWith(
                  notification?.mentionPublication?.metadata?.name
                )
                  ? notification?.mentionPublication?.metadata?.content?.slice(
                      notification?.mentionPublication?.metadata?.name.length
                    )
                  : notification?.mentionPublication?.metadata?.content}
              </Markup>
            </div>
          )}
          {showMore && (
            <Link
              href={`/p/${notification?.mentionPublication?.id}`}
              className="text-blue-400 text-sm sm:text-base"
            >
              Show more
            </Link>
          )}
        </>
      )}
      Icon={() => <GoMention />}
      isRead={isRead}
      cardLink={`/p/${notification?.mentionPublication?.id}`}
    />
  )
}

export default LensNotificationMentionCard
