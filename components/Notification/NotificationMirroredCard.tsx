import Link from 'next/link'
import React from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import { Notification } from '../../graphql/generated'
import { stringToLength } from '../../utils/utils'
import Markup from '../Lexical/Markup'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationMirroredCard = ({
  notification,
  isRead
}: {
  notification: Notification
  isRead: boolean
}) => {
  if (notification.__typename !== 'NewMirrorNotification') return null
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row space-x-2">
          <span onClick={(e) => e.stopPropagation()}>
            <Link href={`/u/${formatHandle(notification?.profile.handle)}`}>
              <div className="font-bold hover:underline">
                {`u/${formatHandle(notification?.profile.handle)}`}
              </div>
            </Link>
          </span>
          <span className=""> mirrored your </span>
          <span className="hover:underline font-bold">
            <Link
              href={
                notification?.publication?.__typename === 'Comment'
                  ? `/p/${notification?.publication?.mainPost?.id}`
                  : `/p/${notification?.publication?.id}`
              }
            >
              <>
                {notification?.publication?.__typename === 'Post' && 'Post'}
                {notification?.publication?.__typename === 'Comment' &&
                  'Comment'}
              </>
            </Link>
          </span>
        </div>
      )}
      Body={() => (
        <div className={`overflow-hidden break-words`}>
          <Markup
            className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
          >
            {stringToLength(notification?.publication?.metadata?.content, 70)}
          </Markup>
        </div>
      )}
      createdAt={notification.createdAt}
      Icon={() => <AiOutlineRetweet />}
      isRead={isRead}
      cardLink={
        notification?.publication?.__typename === 'Comment'
          ? `/p/${notification?.publication?.mainPost?.id}`
          : `/p/${notification?.publication?.id}`
      }
    />
  )
}

export default NotificationMirroredCard
